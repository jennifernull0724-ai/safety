import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

/**
 * STRIPE WEBHOOK → SUBSCRIPTION ACTIVATION
 * 
 * Webhook Events Handled:
 * - checkout.session.completed: Create/activate organization subscription
 * - customer.subscription.updated: Update subscription status
 * - customer.subscription.deleted: Cancel subscription
 * 
 * This is the ONLY PLACE where subscription state changes.
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 * Creates or updates organization with Stripe subscription data
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, pricingTier } = session.metadata || {};

  if (!userId || !pricingTier) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Find or create organization for the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true }
  });

  if (!user) {
    console.error('User not found:', userId);
    return;
  }

  // ATOMIC SUBSCRIPTION ACTIVATION
  if (user.organization) {
    // Update existing organization
    await prisma.organization.update({
      where: { id: user.organization.id },
      data: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        pricingTier,
        subscriptionStatus: 'active',
        subscriptionStartedAt: new Date(),
      }
    });
  } else {
    // Create new organization for user
    const organization = await prisma.organization.create({
      data: {
        name: `${user.name || user.email}'s Organization`,
        type: 'contractor', // Default type
        status: 'active',
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        pricingTier,
        subscriptionStatus: 'active',
        subscriptionStartedAt: new Date(),
      }
    });

    // Associate user with organization
    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: organization.id }
    });
  }

  // Log subscription activation as evidence
  await prisma.evidenceNode.create({
    data: {
      entityType: 'SubscriptionActivated',
      entityId: subscription.id,
      actorType: 'system',
      actorId: 'stripe_webhook',
    }
  });
}

/**
 * Handle customer.subscription.updated event
 * 
 * ENFORCEMENT:
 * - If reactivated, end grace period
 * - If past_due, continue read-only mode
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { endGracePeriod } = await import('@/lib/services/terminationGracePeriod');
  
  const organization = await prisma.organization.findUnique({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!organization) {
    console.error('Organization not found for subscription:', subscription.id);
    return;
  }

  // Map Stripe subscription status to our enum
  let status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing' = 'inactive';
  
  if (subscription.status === 'active') status = 'active';
  else if (subscription.status === 'trialing') status = 'trialing';
  else if (subscription.status === 'past_due') status = 'past_due';
  else if (subscription.status === 'canceled') status = 'canceled';

  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      subscriptionStatus: status,
      subscriptionEndsAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null
    }
  });

  // If subscription reactivated from canceled, end grace period
  if (subscription.status === 'active' && organization.isReadOnlyMode) {
    await endGracePeriod(organization.id);
  }
}

/**
 * Handle customer.subscription.deleted event
 * 
 * ENFORCEMENT:
 * - Start 30-day grace period
 * - Enable read-only mode
 * - QR verification remains functional
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { startGracePeriod } = await import('@/lib/services/terminationGracePeriod');
  
  const organization = await prisma.organization.findUnique({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!organization) {
    console.error('Organization not found for subscription:', subscription.id);
    return;
  }

  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      subscriptionStatus: 'canceled',
      subscriptionEndsAt: new Date()
    }
  });

  // Start 30-day grace period with read-only access
  await startGracePeriod(organization.id);

  // Log subscription cancellation
  await prisma.evidenceNode.create({
    data: {
      entityType: 'SubscriptionCanceled',
      entityId: subscription.id,
      actorType: 'system',
      actorId: 'stripe_webhook',
    }
  });
}

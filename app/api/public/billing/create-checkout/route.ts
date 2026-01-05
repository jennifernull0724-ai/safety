import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * STRIPE CHECKOUT SESSION CREATION
 * 
 * Purpose:
 * - Create Stripe Checkout Session for Organization Subscription
 * 
 * Stripe Metadata (MANDATORY):
 * - userId
 * - pricingTier
 * 
 * PROMO CODE SUPPORT:
 * - Enabled for self-serve tiers (small, mid, large)
 * - Stripe handles validation and discount calculation
 * 
 * Subscription activation happens in webhook ONLY (checkout.session.completed)
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

const tierPricing: Record<string, number> = {
  small: 450000,   // $4,500.00/month
  mid: 950000,     // $9,500.00/month
  large: 1800000   // $18,000.00/month
};

// Enterprise is NOT in tierPricing (invoice-only)
const ENTERPRISE_TIERS = ['enterprise', 'railroad', 'regulator'];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, promoCode } = body;

    if (!tier) {
      return NextResponse.json(
        { error: 'Tier required' },
        { status: 400 }
      );
    }

    // BLOCK ENTERPRISE FROM SELF-SERVE CHECKOUT
    if (ENTERPRISE_TIERS.includes(tier.toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'Enterprise plans require custom quote',
          redirect: '/enterprise-contact'
        },
        { status: 400 }
      );
    }

    if (!tierPricing[tier]) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `T-REX AI OS - ${tier.toUpperCase()} Plan`,
            description: 'Safety compliance and certification management platform'
          },
          unit_amount: tierPricing[tier], // Already in cents
          recurring: {
            interval: 'month'
          }
        },
        quantity: 1,
      }],
      
      // Enable promo codes (Stripe handles validation)
      allow_promotion_codes: true,
      
      metadata: {
        userId: session.user.id,
        pricingTier: tier,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?payment=canceled`,
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    });

  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

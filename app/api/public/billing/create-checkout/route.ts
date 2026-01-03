import { NextResponse } from 'next/server';

/**
 * STRIPE CHECKOUT SESSION CREATION
 * 
 * Purpose:
 * - Create Stripe Checkout Session for Organization Verification License
 * 
 * CRITICAL:
 * - Does NOT activate verification
 * - Does NOT grant authority
 * - Does NOT touch audit tables
 * 
 * Stripe Metadata (MANDATORY):
 * - userId
 * - licenseTier
 * - licenseType: "organization_verification"
 * 
 * PROMO CODE SUPPORT:
 * - Enabled for self-serve tiers (small, mid, large)
 * - Disabled for Enterprise (invoice-only)
 * - Stripe handles validation, NOT this endpoint
 * - Discounts applied by Stripe, NOT locally
 * 
 * License activation happens in webhook ONLY (checkout.session.completed)
 * 
 * NO Base44, NO verification logic
 */

const tierPricing: Record<string, number> = {
  small: 4500,
  mid: 9500,
  large: 18000
};

// Enterprise is NOT in tierPricing (invoice-only)
const ENTERPRISE_TIERS = ['enterprise', 'railroad', 'regulator'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tier, userId } = body;

    if (!tier || !userId) {
      return NextResponse.json(
        { error: 'Tier and userId required' },
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

    // STRIPE INTEGRATION GOES HERE
    // Example using @stripe/stripe-js:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: [{
    //     price_data: {
    //       currency: 'usd',
    //       product_data: {
    //         name: `Organization Verification License - ${tier}`,
    //       },
    //       unit_amount: tierPricing[tier] * 100, // Stripe uses cents
    //     },
    //     quantity: 1,
    //   }],
    //   
    //   // ✅ PROMO CODE ENABLEMENT (SELF-SERVE ONLY)
    //   // Stripe displays "Add promotion code" link
    //   // Stripe handles validation and discount calculation
    //   // NO local coupon logic, NO custom input fields
    //   allow_promotion_codes: true,
    //   
    //   metadata: {
    //     userId,
    //     licenseTier: tier,
    //     licenseType: 'organization_verification'
    //   },
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/complete?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing/select`,
    // });

    // PLACEHOLDER: Return mock checkout URL
    // In production, return session.url
    const mockCheckoutUrl = `https://checkout.stripe.com/mock-session-${tier}`;

    return NextResponse.json({
      checkoutUrl: mockCheckoutUrl,
      sessionId: 'mock_session_123'
    });

  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

/**
 * LANDING PAGE API
 * 
 * Purpose:
 * - Populate landing page dynamically (no hardcoding tiers, copy, or flags)
 * 
 * DOES NOT:
 * - Determine trust
 * - Enable verification
 * - Issue authority
 * - Read audit data
 * 
 * NO Base44, NO auth, NO org context, NO verification references
 */

export async function GET() {
  return NextResponse.json({
    productName: 'System of Proof',
    tagline: 'Compliance verification built for proof',
    ctaPrimary: 'Enter Dashboard',
    ctaSecondary: 'View Pricing',
    status: 'active'
  });
}

import { NextResponse } from 'next/server';

/**
 * PRICING PAGE API (ORGANIZATION LICENSE)
 * 
 * Purpose:
 * - Drive license purchase, NOT authority activation
 * 
 * HARD RULES:
 * - This does NOT activate anything
 * - This does NOT grant authority
 * - It only describes what can be purchased
 * 
 * NO Base44, NO auth, NO verification logic
 */

export async function GET() {
  return NextResponse.json({
    license: 'Organization Verification License',
    billingCadence: 'annual',
    tiers: [
      {
        id: 'small',
        label: 'Small Contractor',
        employeeRange: '≤25',
        price: 4500
      },
      {
        id: 'mid',
        label: 'Mid Contractor',
        employeeRange: '26–100',
        price: 9500
      },
      {
        id: 'large',
        label: 'Large Contractor',
        employeeRange: '100–300',
        price: 18000
      },
      {
        id: 'enterprise',
        label: 'Railroad / Regulator',
        price: 'custom'
      }
    ]
  });
}

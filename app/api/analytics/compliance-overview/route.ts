import { NextResponse } from 'next/server';

/**
 * COMPLIANCE OVERVIEW API
 * 
 * Purpose: Answer "Are we compliant right now?"
 * 
 * Rules:
 * - READ-ONLY
 * - Server-side aggregation only
 * - No historical trends
 * - No percentages
 * - Org-scoped
 */

export async function GET(request: Request) {
  try {
    // TODO: Add auth middleware
    // TODO: Add org-scope middleware
    
    // PLACEHOLDER DATA - Replace with actual Prisma queries
    const response = {
      overall_status: "compliant", // compliant | at_risk | non_compliant
      employees: {
        total: 142,
        compliant: 131,
        non_compliant: 7,
        blocked: 4
      },
      certifications: {
        active: 398,
        expiring_soon: 12, // ≤ 30 days
        expired: 9
      },
      generated_at: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch compliance overview' },
      { status: 500 }
    );
  }
}

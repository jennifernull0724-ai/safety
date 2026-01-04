import { NextResponse } from 'next/server';

/**
 * ACTIVE RISK INDICATORS API
 * 
 * Purpose: Surface action-required issues only
 * 
 * Rules:
 * - Only indicators that require attention
 * - Count + severity only
 * - No drill-down data here (handled by UI routing)
 */

export async function GET(request: Request) {
  try {
    // TODO: Add auth middleware
    // TODO: Add org-scope middleware
    
    // PLACEHOLDER DATA - Replace with actual Prisma queries
    const response = {
      indicators: [
        {
          type: "employees_blocked",
          count: 4,
          severity: "critical"
        },
        {
          type: "certifications_expired",
          count: 9,
          severity: "critical"
        },
        {
          type: "certifications_expiring_soon",
          count: 12,
          severity: "warning"
        },
        {
          type: "recent_incidents",
          count: 1,
          severity: "warning"
        }
      ],
      generated_at: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch risk indicators' },
      { status: 500 }
    );
  }
}

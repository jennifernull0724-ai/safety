import { NextResponse } from 'next/server';

/**
 * RECENT ACTIVITY FEED API
 * 
 * Purpose: Human-readable awareness, not analysis
 * 
 * Rules:
 * - Ordered DESC by timestamp
 * - Immutable log preview
 * - No filters
 * - No mutation paths
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // TODO: Add auth middleware
    // TODO: Add org-scope middleware
    
    // PLACEHOLDER DATA - Replace with actual Prisma queries
    const response = {
      events: [
        {
          event_id: "evt_123",
          event_type: "qr_scanned",
          entity_type: "employee",
          entity_id: "emp_456",
          description: "QR scanned — verified",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          event_id: "evt_124",
          event_type: "certification_expired",
          entity_type: "certification",
          entity_id: "cert_889",
          description: "Certification expired",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        },
        {
          event_id: "evt_125",
          event_type: "employee_blocked",
          entity_type: "employee",
          entity_id: "emp_221",
          description: "Employee blocked due to expired certification",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          event_id: "evt_126",
          event_type: "audit_access",
          entity_type: "audit",
          entity_id: "audit_992",
          description: "Regulator accessed audit trail",
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
        }
      ].slice(0, limit)
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}

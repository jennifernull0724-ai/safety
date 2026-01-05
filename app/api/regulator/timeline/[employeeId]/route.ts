import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/regulator/timeline/[employeeId]
 * 
 * Returns chronological audit timeline for an employee
 * READ-ONLY - No authentication required (public regulator access)
 * Queries ImmutableEventLedger for all events related to employee
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params;
    const searchParams = req.nextUrl.searchParams;
    const dateFilter = searchParams.get('date');

    // Find employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        certifications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Query all evidence nodes for this employee
    const evidenceNodes = await prisma.evidenceNode.findMany({
      where: {
        entityType: 'Employee',
        entityId: employeeId
      },
      include: {
        ImmutableEventLedger: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Also get certification-related evidence
    const certEvidenceNodes = await prisma.evidenceNode.findMany({
      where: {
        entityType: 'Certification',
        entityId: {
          in: employee.certifications.map(c => c.id)
        }
      },
      include: {
        ImmutableEventLedger: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Merge and sort all evidence
    const allEvidence = [...evidenceNodes, ...certEvidenceNodes]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply date filter if provided
    const filteredEvidence = dateFilter
      ? allEvidence.filter(e => e.timestamp >= new Date(dateFilter))
      : allEvidence;

    // Transform to timeline format
    const timeline = filteredEvidence.flatMap(node => 
      node.ImmutableEventLedger.map(ledger => ({
        id: ledger.id,
        timestamp: ledger.createdAt.toISOString(),
        eventType: ledger.eventType,
        description: getEventDescription(ledger.eventType, ledger.payload),
        performedBy: node.actorId,
        actorType: node.actorType,
        payload: ledger.payload,
        evidenceNodeId: node.id
      }))
    );

    return NextResponse.json({
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        status: employee.status
      },
      timeline,
      totalEvents: timeline.length
    });

  } catch (error) {
    console.error('Failed to fetch timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}

/**
 * Generate human-readable description from event type and payload
 */
function getEventDescription(eventType: string, payload: any): string {
  switch (eventType) {
    case 'EMPLOYEE_CREATED':
      return `Employee record created`;
    case 'certification_created':
      return `Certification added: ${payload.certificationType || 'Unknown'}`;
    case 'certification_updated':
      return `Certification updated: ${payload.certificationType || 'Unknown'}`;
    case 'qr_verified':
      return `QR verification scan at ${payload.location || 'unknown location'}`;
    case 'status_changed':
      return `Status changed from ${payload.previousStatus} to ${payload.newStatus}`;
    default:
      return eventType.replace(/_/g, ' ');
  }
}

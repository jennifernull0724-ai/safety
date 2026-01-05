import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/support/activity
 * Returns recent system activity from immutable event ledger
 */
export async function GET(req: NextRequest) {
  try {
    // Get recent events from the immutable ledger
    const events = await prisma.immutableEventLedger.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        evidenceNode: true,
      },
    });

    const activity = events.map(event => ({
      id: event.id,
      timestamp: event.createdAt.toISOString(),
      type: event.eventType,
      description: generateDescription(event),
      user: event.evidenceNode.actorId,
      traceable: true,
    }));

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateDescription(event: any): string {
  const payload = event.payload as any;
  
  switch (event.eventType) {
    case 'certification_corrected':
      return `Certification corrected: ${payload.reason || 'No reason provided'}`;
    case 'audit_package_exported':
      return `Audit package exported (${payload.totalEvidenceItems} items)`;
    case 'audit_case_created':
      return `Audit case created: ${payload.title}`;
    case 'evidence_attached_to_audit':
      return `Evidence attached to audit case`;
    default:
      return `${event.eventType.replace(/_/g, ' ')}`;
  }
}

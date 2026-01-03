import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/incidents - List all incidents
export async function GET(req: NextRequest) {
  const incidents = await prisma.incident.findMany({
    include: { employees: true, organization: true },
    orderBy: { occurredAt: 'desc' },
  });
  return NextResponse.json(incidents);
}

// POST /api/incidents - Create incident
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Incident',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.reportedBy || 'system',
    eventType: 'incident_created',
    payload: data,
    action: async () => {
      return prisma.incident.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

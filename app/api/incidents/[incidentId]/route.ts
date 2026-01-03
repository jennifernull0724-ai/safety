import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/incidents/:incidentId
export async function GET(req: NextRequest, { params }: { params: { incidentId: string } }) {
  const incident = await prisma.incident.findUnique({
    where: { id: params.incidentId },
    include: { employees: { include: { employee: true } }, organization: true },
  });
  if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(incident);
}

// PATCH /api/incidents/:incidentId
export async function PATCH(req: NextRequest, { params }: { params: { incidentId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Incident',
    entityId: params.incidentId,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'incident_updated',
    payload: data,
    action: async () => {
      return prisma.incident.update({ where: { id: params.incidentId }, data });
    },
  });
  return NextResponse.json(result);
}

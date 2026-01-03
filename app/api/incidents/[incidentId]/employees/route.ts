import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/incidents/:incidentId/employees - Attach employee to incident
export async function POST(req: NextRequest, { params }: { params: { incidentId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'IncidentEmployee',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.attachedBy || 'system',
    eventType: 'employee_attached_to_incident',
    payload: { incidentId: params.incidentId, employeeId: data.employeeId },
    action: async () => {
      return prisma.incidentEmployee.create({
        data: { incidentId: params.incidentId, employeeId: data.employeeId, role: data.role },
      });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/employees/:employeeId
export async function GET(req: NextRequest, { params }: { params: { employeeId: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.employeeId },
    include: { certification: true, organization: true },
  });
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(employee);
}

// PATCH /api/employees/:employeeId
export async function PATCH(req: NextRequest, { params }: { params: { employeeId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Employee',
    entityId: params.employeeId,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'employee_updated',
    payload: data,
    action: async () => {
      return prisma.employee.update({ where: { id: params.employeeId }, data });
    },
  });
  return NextResponse.json(result);
}

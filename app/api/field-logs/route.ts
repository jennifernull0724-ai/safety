import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/field-logs - List all field logs
export async function GET(req: NextRequest) {
  const logs = await prisma.fieldLog.findMany({
    include: { employee: true },
    orderBy: { loggedAt: 'desc' },
  });
  return NextResponse.json(logs);
}

// POST /api/field-logs - Create field log (employee-generated)
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'FieldLog',
    entityId: 'pending',
    actorType: 'employee',
    actorId: data.employeeId,
    eventType: 'field_log_created',
    payload: data,
    action: async () => {
      return prisma.fieldLog.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

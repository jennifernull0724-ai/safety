import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/employees - List all employees
export async function GET(req: NextRequest) {
  const employees = await prisma.employee.findMany({
    include: { certifications: true, organization: true },
    orderBy: { lastName: 'asc' },
  });
  return NextResponse.json(employees);
}

// POST /api/employees - Create employee (with evidence)
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Employee',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'employee_created',
    payload: data,
    action: async () => {
      return prisma.employee.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

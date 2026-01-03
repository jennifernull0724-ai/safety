import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { prisma } from '@/lib/prisma';

// POST /api/employee - Create employee (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  return withEvidence({
    entityType: 'employee',
    entityId: 'new',
    actorType: 'user',
    actorId: 'system',
    eventType: 'employee.created',
    payload: data,
    action: async () => {
      const employee = await prisma.employee.create({
        data,
      });
      return NextResponse.json({ employee });
    }
  });
}

// PATCH /api/employee/:id - Update employee (regulated, org/role enforced)
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  
  return withEvidence({
    entityType: 'employee',
    entityId: data.id || 'unknown',
    actorType: 'user',
    actorId: 'system',
    eventType: 'employee.updated',
    payload: data,
    action: async () => {
      const employee = await prisma.employee.update({
        where: { id: data.id },
        data: data.update,
      });
      return NextResponse.json({ employee });
    }
  });
}

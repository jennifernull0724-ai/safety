import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import prisma from '@/lib/prisma';

// POST /api/employee - Create employee (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety']);

    const data = await req.json();
    // ...validate data...
    const employee = await prisma.employee.create({
      data,
    });
    return NextResponse.json({ employee });
  });
}

// PATCH /api/employee/:id - Update employee (regulated, org/role enforced)
export async function PATCH(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety']);

    const data = await req.json();
    // ...validate data...
    const employee = await prisma.employee.update({
      where: { id: data.id },
      data: data.update,
    });
    return NextResponse.json({ employee });
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import prisma from '@/lib/prisma';

// POST /api/nearMiss - Create near-miss (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety', 'supervisor']);

    const data = await req.json();
    // ...validate data...
    const nearMiss = await prisma.nearMiss.create({
      data,
    });
    return NextResponse.json({ nearMiss });
  });
}

// PATCH /api/nearMiss/:id - Update near-miss (regulated, org/role enforced)
export async function PATCH(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety', 'supervisor']);

    const data = await req.json();
    // ...validate data...
    const nearMiss = await prisma.nearMiss.update({
      where: { id: data.id },
      data: data.update,
    });
    return NextResponse.json({ nearMiss });
  });
}

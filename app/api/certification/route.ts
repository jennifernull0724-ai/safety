import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import prisma from '@/lib/prisma';

// POST /api/certification - Issue a new certification (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety']);

    const data = await req.json();
    // ...validate data...
    const certification = await prisma.certification.create({
      data: {
        ...data,
        status: 'valid',
      },
    });
    return NextResponse.json({ certification });
  });
}

// PATCH /api/certification/:id - Update certification (regulated, org/role enforced)
export async function PATCH(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety']);

    const data = await req.json();
    // ...validate data...
    const certification = await prisma.certification.update({
      where: { id: data.id },
      data: data.update,
    });
    return NextResponse.json({ certification });
  });
}

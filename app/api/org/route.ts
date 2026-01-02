import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import prisma from '@/lib/prisma';

// POST /api/org - Create org (regulated, admin only)
export async function POST(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceRole(context, ['admin']);

    const data = await req.json();
    // ...validate data...
    const org = await prisma.org.create({
      data,
    });
    return NextResponse.json({ org });
  });
}

// PATCH /api/org/:id - Update org (regulated, admin only)
export async function PATCH(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceRole(context, ['admin']);

    const data = await req.json();
    // ...validate data...
    const org = await prisma.org.update({
      where: { id: data.id },
      data: data.update,
    });
    return NextResponse.json({ org });
  });
}

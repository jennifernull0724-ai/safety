import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { prisma } from '@/lib/prisma';

// POST /api/org - Create org (regulated, admin only)
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  return withEvidence({
    entityType: 'organization',
    entityId: 'new',
    actorType: 'user',
    actorId: 'system',
    eventType: 'organization.created',
    payload: data,
    action: async () => {
      const organization = await prisma.organization.create({
        data,
      });
      return NextResponse.json({ organization });
    }
  });
}

// PATCH /api/org/:id - Update org (regulated, admin only)
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  
  return withEvidence({
    entityType: 'organization',
    entityId: data.id || 'unknown',
    actorType: 'user',
    actorId: 'system',
    eventType: 'organization.updated',
    payload: data,
    action: async () => {
      const organization = await prisma.organization.update({
        where: { id: data.id },
        data: data.update,
      });
      return NextResponse.json({ organization });
    }
  });
}

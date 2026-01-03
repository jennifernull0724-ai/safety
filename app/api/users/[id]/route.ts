import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// PATCH /api/users/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'User',
    entityId: params.id,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'user_updated',
    payload: data,
    action: async () => {
      return prisma.user.update({ where: { id: params.id }, data });
    },
  });
  return NextResponse.json(result);
}

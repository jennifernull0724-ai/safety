import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/organizations/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const org = await prisma.organization.findUnique({
    where: { id: params.id },
  });
  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(org);
}

// PATCH /api/organizations/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Organization',
    entityId: params.id,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'organization_updated',
    payload: data,
    action: async () => {
      return prisma.organization.update({ where: { id: params.id }, data });
    },
  });
  return NextResponse.json(result);
}

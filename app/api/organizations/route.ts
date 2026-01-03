import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/organizations - Create organization
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Organization',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'organization_created',
    payload: data,
    action: async () => {
      return prisma.organization.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

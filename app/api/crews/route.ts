import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/crews - List all crews
export async function GET(req: NextRequest) {
  const crews = await prisma.crew.findMany({
    include: { members: { include: { employee: true } }, organization: true },
  });
  return NextResponse.json(crews);
}

// POST /api/crews - Create crew
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Crew',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'crew_created',
    payload: data,
    action: async () => {
      return prisma.crew.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

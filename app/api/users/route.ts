import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/users - List all users
export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    include: { organization: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

// POST /api/users - Create user
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'User',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'user_created',
    payload: data,
    action: async () => {
      return prisma.user.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

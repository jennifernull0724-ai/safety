import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/safety/observations - List all safety observations / near misses
export async function GET(req: NextRequest) {
  const observations = await prisma.nearMiss.findMany({
    orderBy: { reportedAt: 'desc' },
  });
  return NextResponse.json(observations);
}

// POST /api/safety/observations - Create safety observation
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'NearMiss',
    entityId: 'pending',
    actorType: data.reportedByEmployeeId ? 'employee' : 'user',
    actorId: data.reportedByEmployeeId || data.reportedByUserId || 'anonymous',
    eventType: 'safety_observation_created',
    payload: data,
    action: async () => {
      return prisma.nearMiss.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/work-windows - List all work windows
export async function GET(req: NextRequest) {
  const workWindows = await prisma.workWindow.findMany({
    include: { Organization: true },
    orderBy: { startTime: 'desc' },
  });
  return NextResponse.json(workWindows);
}

// POST /api/work-windows - Create work window (enforces certification eligibility)
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'WorkWindow',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'work_window_created',
    payload: data,
    action: async () => {
      return prisma.workWindow.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

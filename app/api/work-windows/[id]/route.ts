import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/work-windows/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const workWindow = await prisma.workWindow.findUnique({
    where: { id: params.id },
    include: { Organization: true },
  });
  if (!workWindow) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(workWindow);
}

// PATCH /api/work-windows/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'WorkWindow',
    entityId: params.id,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'work_window_updated',
    payload: data,
    action: async () => {
      return prisma.workWindow.update({ where: { id: params.id }, data });
    },
  });
  return NextResponse.json(result);
}

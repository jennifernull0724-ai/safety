import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { prisma } from '@/lib/prisma';

// POST /api/jha - Create JHA
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'JobHazardAnalysis',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'jha_created',
    payload: data,
    action: async () => {
      return prisma.jobHazardAnalysis.create({ data });
    },
  });
  return NextResponse.json({ jha: result });
}

// PATCH /api/jha/:id - Update JHA
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'JobHazardAnalysis',
    entityId: data.id,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'jha_updated',
    payload: data,
    action: async () => {
      return prisma.jobHazardAnalysis.update({
        where: { id: data.id },
        data: data.update,
      });
    },
  });
  return NextResponse.json({ jha: result });
}

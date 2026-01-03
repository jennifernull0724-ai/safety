import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { prisma } from '@/lib/prisma';

// POST /api/certification - Issue a new certification
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Certification',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdByUserId || 'system',
    eventType: 'certification_created',
    payload: data,
    action: async () => {
      return prisma.certification.create({
        data: {
          ...data,
          status: 'valid',
        },
      });
    },
  });
  return NextResponse.json({ certification: result });
}

// PATCH /api/certification/:id - Update certification
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Certification',
    entityId: data.id,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'certification_updated',
    payload: data,
    action: async () => {
      return prisma.certification.update({
        where: { id: data.id },
        data: data.update,
      });
    },
  });
  return NextResponse.json({ certification: result });
}

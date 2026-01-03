import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/certifications/:certId
export async function GET(req: NextRequest, { params }: { params: { certId: string } }) {
  const certification = await prisma.certification.findUnique({
    where: { id: params.certId },
    include: { Employee: true },
  });
  if (!certification) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(certification);
}

// PATCH /api/certifications/:certId
export async function PATCH(req: NextRequest, { params }: { params: { certId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Certification',
    entityId: params.certId,
    actorType: 'user',
    actorId: data.updatedBy || 'system',
    eventType: 'certification_updated',
    payload: data,
    action: async (tx) => {
      return tx.certification.update({ where: { id: params.certId }, data });
    },
  });
  return NextResponse.json(result);
}

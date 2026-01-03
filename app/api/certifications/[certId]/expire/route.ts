import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/certifications/:certId/expire
export async function POST(req: NextRequest, { params }: { params: { certId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Certification',
    entityId: params.certId,
    actorType: 'system',
    actorId: 'expiration_job',
    eventType: 'certification_expired',
    payload: {},
    action: async (tx) => {
      return tx.certification.update({
        where: { id: params.certId },
        data: { status: 'expired' },
      });
    },
  });
  return NextResponse.json(result);
}

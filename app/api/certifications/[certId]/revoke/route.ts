import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/certifications/:certId/revoke
export async function POST(req: NextRequest, { params }: { params: { certId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Certification',
    entityId: params.certId,
    actorType: 'user',
    actorId: data.revokedBy || 'system',
    eventType: 'certification_revoked',
    payload: { reason: data.reason },
    action: async (tx) => {
      return tx.certification.update({
        where: { id: params.certId },
        data: { status: 'revoked', revokedAt: new Date(), revokedReason: data.reason },
      });
    },
  });
  return NextResponse.json(result);
}

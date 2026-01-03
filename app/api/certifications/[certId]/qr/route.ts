import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';
import { generateQrToken } from '@/lib/qrToken';

// POST /api/certifications/:certId/qr - Generate QR token for certification
export async function POST(req: NextRequest, { params }: { params: { certId: string } }) {
  const data = await req.json();
  const { rawToken, verificationToken } = await generateQrToken({ certificationId: params.certId });
  
  const result = await withEvidence({
    entityType: 'VerificationToken',
    entityId: verificationToken.id,
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'qr_token_generated',
    payload: { certificationId: params.certId },
    action: async () => {
      return { token: rawToken, verificationToken };
    },
  });
  return NextResponse.json(result, { status: 201 });
}

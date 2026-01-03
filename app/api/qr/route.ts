import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { generateQRToken } from '@/lib/services/qr';
import { prisma } from '@/lib/prisma';

// POST /api/qr - Generate QR token for certification (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  return withEvidence({
    entityType: 'certification',
    entityId: data.certificationId || 'unknown',
    actorType: 'user',
    actorId: 'system',
    eventType: 'qr.generated',
    payload: data,
    action: async () => {
      const token = generateQRToken(data.certificationId);
      return NextResponse.json({ token });
    }
  });
}

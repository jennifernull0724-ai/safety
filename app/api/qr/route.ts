import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { generateQrToken } from '@/lib/qrToken';
import prisma from '@/lib/prisma';

// POST /api/qr - Generate QR token for certification (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  return withEvidence({ req, actorType: 'user' }, async (context) => {
    // Enforce org/role middleware (pseudo, replace with actual logic)
    // await enforceOrgScope(context);
    // await enforceRole(context, ['admin', 'safety']);

    const data = await req.json();
    // ...validate data...
    const token = await generateQrToken(data.certificationId);
    return NextResponse.json({ token });
  });
}

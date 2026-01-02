import { NextRequest, NextResponse } from 'next/server';
import { writeEvidenceNode, appendLedgerEntry } from '@/lib/evidence';
import prisma from '@/lib/prisma';

// POST /api/scan - Log a QR scan (public, append-only, no mutation)
export async function POST(req: NextRequest) {
  const data = await req.json();
  // ...validate data...
  const verificationEvent = await prisma.verificationEvent.create({
    data: {
      verificationTokenId: data.tokenId,
      result: data.result,
    },
  });
  const evidence = await writeEvidenceNode({
    entityType: 'VerificationEvent',
    entityId: verificationEvent.id,
    actorType: 'system',
    actorId: 'public-qr',
  });
  await appendLedgerEntry({
    evidenceNodeId: evidence.id,
    eventType: 'QR_VERIFIED',
    payload: {
      verificationTokenId: data.tokenId,
      verificationEventId: verificationEvent.id,
      status: data.status,
    },
  });
  return NextResponse.json({ scanId: verificationEvent.id });
}

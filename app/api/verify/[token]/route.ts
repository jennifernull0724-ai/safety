import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '@/lib/evidence';

// Map certification status to verification result
function mapToVerificationResult(certStatus: string): 'valid' | 'expired' | 'revoked' {
  if (certStatus === 'valid' || certStatus === 'expiring') return 'valid';
  if (certStatus === 'expired') return 'expired';
  return 'revoked';
}

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  // 1. Find the VerificationToken by hash
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { tokenHash: token },
    include: { certification: true },
  });
  if (!verificationToken) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  // 2. Log the verification event (append-only)
  const verificationEvent = await prisma.verificationEvent.create({
    data: {
      verificationTokenId: verificationToken.id,
      result: verificationToken.status === 'active'
        ? mapToVerificationResult(verificationToken.certification.status)
        : 'revoked',
    },
  });

  // 3. Write evidence node and ledger entry
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
      verificationTokenId: verificationToken.id,
      verificationEventId: verificationEvent.id,
      status: verificationToken.certification.status,
    },
  });

  // 4. Return public status (never mutates cert)
  return NextResponse.json({
    certificationId: verificationToken.certification.id,
    status: verificationToken.certification.status,
    expires: verificationToken.certification.expirationDate,
    scanId: verificationEvent.id,
  });
}

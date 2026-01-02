// jobs/certificationExpirationJob.ts
import prisma from '../lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '../lib/evidence';

/**
 * Daily job: Expires certifications past expirationDate and blocks work.
 * Writes evidence and ledger for each expired cert.
 */
export async function certificationExpirationJob() {
  const now = new Date();
  const expiredCerts = await prisma.certification.findMany({
    where: {
      status: { in: ['valid', 'expiring'] },
      expirationDate: { lt: now },
    },
  });

  for (const cert of expiredCerts) {
    await prisma.certification.update({
      where: { id: cert.id },
      data: { status: 'expired' },
    });
    const evidence = await writeEvidenceNode({
      entityType: 'Certification',
      entityId: cert.id,
      actorType: 'system',
      actorId: 'cert-expiry-job',
    });
    await appendLedgerEntry({
      evidenceNodeId: evidence.id,
      eventType: 'CERT_EXPIRED',
      payload: { certificationId: cert.id, expiredAt: now },
    });
  }
}

// jobs/certificationExpirationJob.ts
import { prisma } from '../lib/prisma.js';

/**
 * Daily job: Expires certifications past expirationDate and blocks work.
 * Writes enforcement and ledger for each expired cert.
 */
export async function runCertificationExpirationJob() {
  console.log('[CRON] Running certification expiration job...');
  
  const now = new Date();
  const expiredCerts = await prisma.certification.findMany({
    where: {
      isNonExpiring: false,
      expirationDate: { lte: now },
      status: { not: 'FAIL' },
    },
  });

  let expiredCount = 0;

  for (const cert of expiredCerts) {
    await prisma.certification.update({
      where: { id: cert.id },
      data: { status: 'FAIL' },
    });

    await prisma.certificationEnforcement.upsert({
      where: { certificationId: cert.id },
      create: {
        certificationId: cert.id,
        isBlocked: true,
        blockedReason: `Expired on ${cert.expirationDate?.toISOString().split('T')[0]}`,
      },
      update: {
        isBlocked: true,
        blockedReason: `Expired on ${cert.expirationDate?.toISOString().split('T')[0]}`,
        evaluatedAt: now,
      },
    });

    await prisma.enforcementAction.create({
      data: {
        actionType: 'certification_block',
        targetType: 'certification',
        targetId: cert.id,
        reason: `Certification expired`,
        triggeredBy: 'expiration_job',
      },
    });

    expiredCount++;
  }

  console.log(`[CRON] Expired and blocked: ${expiredCount} certifications`);
  return { expiredCount };
}

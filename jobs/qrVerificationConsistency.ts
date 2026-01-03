// jobs/qrVerificationConsistency.ts
import { prisma } from '../lib/prisma.js';

/**
 * QR verification consistency (hourly):
 * Detects excessive QR scans (anomaly detection).
 */
export async function runQRVerificationConsistency() {
  console.log('[CRON] Running QR verification consistency...');

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentScans = await prisma.verificationEvent.groupBy({
    by: ['employeeId'],
    where: { scannedAt: { gte: oneHourAgo } },
    _count: { id: true },
  });

  let flaggedCount = 0;
  for (const scan of recentScans) {
    if (scan._count.id > 20) {
      await prisma.enforcementAction.create({
        data: {
          actionType: 'certification_block',
          targetType: 'employee',
          targetId: scan.employeeId,
          reason: `Excessive QR scans detected: ${scan._count.id} in 1 hour`,
          triggeredBy: 'qr_verification_consistency',
        },
      });
      flaggedCount++;
    }
  }

  console.log(`[CRON] Flagged ${flaggedCount} QR anomalies`);
  return { flaggedCount };
}

// jobs/jhaEnforcementSweep.ts
import { prisma } from '../lib/prisma.js';

/**
 * JHA enforcement sweep (every 30 min):
 * Detects mid-shift certification expirations and flags JHAs.
 */
export async function runJHAEnforcementSweep() {
  console.log('[CRON] Running JHA enforcement sweep...');

  const activeJHAs = await prisma.jobHazardAnalysis.findMany({
    where: { status: 'active' },
    include: {
      acknowledgments: {
        include: {
          employee: {
            include: {
              certifications: {
                include: { enforcement: true },
              },
            },
          },
        },
      },
    },
  });

  let flaggedCount = 0;

  for (const jha of activeJHAs) {
    for (const ack of jha.acknowledgments) {
      const blockedCerts = ack.employee.certifications.filter(
        c => c.enforcement?.isBlocked
      );

      if (blockedCerts.length > 0) {
        await prisma.enforcementAction.create({
          data: {
            actionType: 'jha_block',
            targetType: 'jha',
            targetId: jha.id,
            reason: `Employee ${ack.employeeId} cert expired mid-shift: ${blockedCerts.map(c => c.certificationType).join(', ')}`,
            triggeredBy: 'jha_enforcement_sweep',
          },
        });

        flaggedCount++;
      }
    }
  }

  console.log(`[CRON] Flagged ${flaggedCount} JHA violations`);
  return { flaggedCount };
}

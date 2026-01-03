// jobs/auditReadinessScoring.ts
import { prisma } from '../lib/prisma.js';

/**
 * Audit readiness scoring (nightly):
 * Advisory only - scores orgs for compliance gaps.
 */
export async function runAuditReadinessScoring() {
  console.log('[CRON] Running audit readiness scoring...');

  const orgs = await prisma.organization.findMany({
    include: {
      employees: {
        include: { certifications: true },
      },
    },
  });

  const scores: Record<string, number> = {};
  for (const org of orgs) {
    const totalCerts = org.employees.flatMap(e => e.certifications).length;
    const passingCerts = org.employees
      .flatMap(e => e.certifications)
      .filter(c => c.status === 'PASS').length;
    const score = totalCerts > 0 ? Math.round((passingCerts / totalCerts) * 100) : 0;
    scores[org.id] = score;
  }

  console.log('[CRON] Audit readiness scores:', scores);
  return { scores };
}

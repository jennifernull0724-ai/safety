// jobs/fatigueRiskJob.ts
import prisma from '../lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '../lib/evidence';

/**
 * Fatigue risk job (every 2 hr):
 * Flags employees with excessive hours or risk factors.
 * Writes evidence and ledger for each flagged case.
 */
export async function fatigueRiskJob() {
  // Example: flag employees with >12h in last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const logs = await prisma.fieldLog.findMany({
    where: { createdAt: { gte: since } },
    select: { employeeId: true, createdAt: true },
  });
  const hoursByEmployee: Record<string, number> = {};
  for (const log of logs) {
    hoursByEmployee[log.employeeId] = (hoursByEmployee[log.employeeId] || 0) + 1; // 1 log = 1 hour (example)
  }
  for (const [employeeId, hours] of Object.entries(hoursByEmployee)) {
    if (hours > 12) {
      const evidence = await writeEvidenceNode({
        entityType: 'FatigueRisk',
        entityId: employeeId,
        actorType: 'system',
        actorId: 'fatigue-risk-job',
      });
      await appendLedgerEntry({
        evidenceNodeId: evidence.id,
        eventType: 'FATIGUE_RISK_FLAGGED',
        payload: { employeeId, hours },
      });
    }
  }
}

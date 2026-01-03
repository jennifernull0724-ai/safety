// jobs/fatigueRiskJob.ts
import { prisma } from '../lib/prisma.js';

/**
 * Fatigue risk assessment (every 2 hours):
 * Blocks employees with >12 hours in 24-hour window.
 */
export async function runFatigueRiskJob() {
  console.log('[CRON] Running fatigue risk assessment...');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const workWindows = await prisma.workWindow.groupBy({
    by: ['employeeId'],
    where: { startTime: { gte: twentyFourHoursAgo } },
    _count: { id: true },
  });

  let blockedCount = 0;
  for (const employee of workWindows) {
    if (employee._count.id > 12) {
      await prisma.enforcementAction.create({
        data: {
          actionType: 'work_window_block',
          targetType: 'employee',
          targetId: employee.employeeId,
          reason: `Fatigue risk: ${employee._count.id} hours in 24-hour window`,
          triggeredBy: 'fatigue_risk_job',
        },
      });
      blockedCount++;
    }
  }

  console.log(`[CRON] Blocked ${blockedCount} employees for fatigue risk`);
  return { blockedCount };
}

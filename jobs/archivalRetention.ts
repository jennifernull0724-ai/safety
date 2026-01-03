// jobs/archivalRetention.ts
import { prisma } from '../lib/prisma.js';

const RETENTION_DAYS = 90;

/**
 * Archival & retention (monthly):
 * Marks old evidence as archived (NO DELETES).
 */
export async function runArchivalRetention() {
  console.log('[CRON] Running archival retention...');

  const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const result = await prisma.evidenceNode.updateMany({
    where: {
      createdAt: { lt: cutoffDate },
      archived: false,
    },
    data: {
      archived: true,
      archivedAt: new Date(),
    },
  });

  console.log(`[CRON] Archived ${result.count} evidence nodes`);
  return { archivedCount: result.count };
}

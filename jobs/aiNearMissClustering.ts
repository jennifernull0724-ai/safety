// jobs/aiNearMissClustering.ts
import { prisma } from '../lib/prisma.js';

/**
 * AI near-miss clustering (nightly):
 * Advisory only - groups near-misses by pattern.
 */
export async function runAINearMissClustering() {
  console.log('[CRON] Running AI near-miss clustering...');

  const nearMisses = await prisma.incident.findMany({
    where: { incidentType: 'near_miss' },
    select: { id: true, severity: true, description: true },
  });

  const clusters: Record<string, number> = {};
  for (const incident of nearMisses) {
    const key = incident.severity || 'unknown';
    clusters[key] = (clusters[key] || 0) + 1;
  }

  console.log(`[CRON] Clustered ${nearMisses.length} near-misses:`, clusters);
  return { clusters };
}

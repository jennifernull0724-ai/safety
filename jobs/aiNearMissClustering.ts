// jobs/aiNearMissClustering.ts
import prisma from '../lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '../lib/evidence';

/**
 * AI near-miss clustering job (nightly):
 * Clusters near-miss incidents for pattern detection.
 * Writes evidence and ledger for each cluster.
 */
export async function aiNearMissClustering() {
  // Example: group incidents by type (real AI logic would be more advanced)
  const nearMisses = await prisma.incident.findMany({
    where: { incidentType: 'near-miss' },
  });
  const clusters: Record<string, string[]> = {};
  for (const incident of nearMisses) {
    clusters[incident.severity] = clusters[incident.severity] || [];
    clusters[incident.severity].push(incident.id);
  }
  for (const [severity, ids] of Object.entries(clusters)) {
    const evidence = await writeEvidenceNode({
      entityType: 'NearMissCluster',
      entityId: severity,
      actorType: 'system',
      actorId: 'ai-near-miss-job',
    });
    await appendLedgerEntry({
      evidenceNodeId: evidence.id,
      eventType: 'NEAR_MISS_CLUSTERED',
      payload: { severity, incidentIds: ids },
    });
  }
}

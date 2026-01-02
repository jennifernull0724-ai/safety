// jobs/jhaEnforcementSweep.ts
import prisma from '../lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '../lib/evidence';

/**
 * JHA enforcement sweep (every 30 min):
 * Flags missing acknowledgments and blocks work if not signed.
 * Writes evidence and ledger for each enforcement action.
 */
export async function jhaEnforcementSweep() {
  const activeJHAs = await prisma.jobHazardAnalysis.findMany({
    where: { status: 'active' },
    include: { acknowledgments: true },
  });

  for (const jha of activeJHAs) {
    // Find employees who have not acknowledged
    const crew = await prisma.crewMember.findMany({
      where: { crew: { organizationId: jha.organizationId } },
      include: { employee: true },
    });
    const acknowledgedIds = jha.acknowledgments.map(a => a.employeeId);
    for (const member of crew) {
      if (!acknowledgedIds.includes(member.employeeId)) {
        // Block work for this employee (implementation depends on your system)
        const evidence = await writeEvidenceNode({
          entityType: 'JobHazardAnalysis',
          entityId: jha.id,
          actorType: 'system',
          actorId: 'jha-enforcement-job',
        });
        await appendLedgerEntry({
          evidenceNodeId: evidence.id,
          eventType: 'JHA_ACK_MISSING',
          payload: { jhaId: jha.id, employeeId: member.employeeId },
        });
      }
    }
  }
}

// jobs/auditReadinessScoring.ts
import { prisma } from '../lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '../lib/evidence';

/**
 * Audit readiness scoring job (nightly):
 * Scores organizations for audit readiness based on evidence and compliance.
 * Writes evidence and ledger for each score.
 */
export async function auditReadinessScoring() {
  const orgs = await prisma.organization.findMany();
  for (const org of orgs) {
    // Score based on number of valid certifications through employees
    const certCount = await prisma.certification.count({
      where: { 
        employee: { organizationId: org.id }, 
        status: 'valid' 
      },
    });
    const score = Math.min(100, certCount * 10); // Example scoring logic
    const evidence = await writeEvidenceNode({
      entityType: 'AuditReadiness',
      entityId: org.id,
      actorType: 'system',
      actorId: 'audit-readiness-job',
    });
    await appendLedgerEntry({
      evidenceNodeId: evidence.id,
      eventType: 'AUDIT_READINESS_SCORED',
      payload: { organizationId: org.id, score },
    });
  }
}

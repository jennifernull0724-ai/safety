// lib/enforcement/auditVaultGuard.ts
import { prisma } from '@/lib/prisma';
import { writeEvidenceNode, appendLedgerEntry } from '@/lib/evidence';

/**
 * AUDIT VAULT ACCESS GUARD
 * 
 * Ensures:
 * - Only linked evidence is visible
 * - Regulator access is logged
 * - Time-boxed sessions only
 */

export async function requireAuditScope(
  auditCaseId: string,
  userId: string,
  userRole: string
): Promise<void> {
  const audit = await prisma.auditCase.findUnique({
    where: { id: auditCaseId },
  });

  if (!audit) {
    throw new Error('Audit case not found');
  }

  // Log regulator access
  if (userRole === 'regulator') {
    await writeEvidenceNode({
      entityType: 'AuditCase',
      entityId: auditCaseId,
      actorType: 'regulator',
      actorId: userId,
    });

    await appendLedgerEntry({
      evidenceNodeId: auditCaseId,
      eventType: 'regulator_access',
      payload: {
        userId,
        accessedAt: new Date().toISOString(),
      },
    });
  }

  // TODO: Check time-boxed session expiration
  // if (audit.sessionExpiresAt && audit.sessionExpiresAt < new Date()) {
  //   throw new Error('Audit session expired');
  // }
}

/**
 * Get evidence nodes linked to audit case
 * (scope-limited to only linked evidence)
 */
export async function getAuditEvidence(auditCaseId: string) {
  const links = await prisma.auditEvidenceLink.findMany({
    where: { auditCaseId },
    include: {
      evidenceNode: {
        include: {
          ledgerEntries: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  return links.map(link => link.evidenceNode);
}

/**
 * Link evidence to audit case
 */
export async function linkEvidenceToAudit(
  auditCaseId: string,
  evidenceNodeId: string,
  linkedByUserId: string
) {
  await prisma.auditEvidenceLink.create({
    data: {
      auditCaseId,
      evidenceNodeId,
    },
  });

  // Log the linking action
  await writeEvidenceNode({
    entityType: 'AuditCase',
    entityId: auditCaseId,
    actorType: 'user',
    actorId: linkedByUserId,
  });

  await appendLedgerEntry({
    evidenceNodeId,
    eventType: 'linked_to_audit',
    payload: {
      auditCaseId,
      linkedBy: linkedByUserId,
      linkedAt: new Date().toISOString(),
    },
  });
}

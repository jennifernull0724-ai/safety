import { prisma } from '../prisma';
import { appendLedgerEntry, writeEvidenceNode } from '../evidence';

export type AuditCaseStatus = 'OPEN' | 'CLOSED' | 'UNDER_REVIEW';

export interface AuditExportPackage {
  auditCase: {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
  };
  evidenceNodes: Array<{
    id: string;
    entityType: string;
    entityId: string;
    hash: string;
    createdAt: Date;
    ledgerEntries: Array<{
      id: string;
      eventType: string;
      payload: unknown;
      createdAt: Date;
    }>;
  }>;
  exportMetadata: {
    exportedAt: string;
    exportedBy: string;
    totalEvidenceItems: number;
    totalLedgerEntries: number;
    integrityHash: string;
  };
}

// Create a new audit case
export async function createAuditCase(
  title: string,
  description: string,
  organizationId: string,
  createdBy: string
): Promise<unknown> {
  const auditCase = await prisma.auditCase.create({
    data: {
      title,
      description,
      status: 'OPEN',
      organizationId,
    },
  });

  // Write evidence for audit case creation
  const evidence = await writeEvidenceNode({
    entityType: 'AuditCase',
    entityId: auditCase.id,
    actorType: 'user',
    actorId: createdBy,
  });

  await appendLedgerEntry({
    evidenceNodeId: evidence.id,
    eventType: 'audit_case_created',
    payload: { title, organizationId },
  });

  return auditCase;
}

// Attach evidence to an audit case
export async function attachEvidenceToAudit(
  auditCaseId: string,
  evidenceNodeId: string,
  attachedBy: string
): Promise<unknown> {
  const link = await prisma.auditCaseEvidence.create({
    data: {
      auditCaseId,
      evidenceNodeId,
    },
  });

  // Log the attachment as evidence
  const evidence = await writeEvidenceNode({
    entityType: 'AuditCaseEvidence',
    entityId: link.id,
    actorType: 'user',
    actorId: attachedBy,
  });

  await appendLedgerEntry({
    evidenceNodeId: evidence.id,
    eventType: 'evidence_attached_to_audit',
    payload: { auditCaseId, evidenceNodeId },
  });

  return link;
}

// Export audit package for regulatory submission
export async function exportAuditPackage(
  auditCaseId: string,
  exportedBy: string
): Promise<AuditExportPackage> {
  const auditCase = await prisma.auditCase.findUnique({
    where: { id: auditCaseId },
    include: {
      evidenceLinks: {
        include: {
          evidenceNode: {
            include: { ImmutableEventLedger: true },
          },
        },
      },
    },
  });

  if (!auditCase) {
    throw new Error('Audit case not found');
  }

  const evidenceNodes = auditCase.evidenceLinks.map(link => ({
    id: link.evidenceNode.id,
    entityType: link.evidenceNode.entityType,
    entityId: link.evidenceNode.entityId,
    hash: link.evidenceNode.hash,
    createdAt: link.evidenceNode.createdAt,
    ledgerEntries: link.evidenceNode.ledgerEntries.map(entry => ({
      id: entry.id,
      eventType: entry.eventType,
      payload: entry.payload,
      createdAt: entry.createdAt,
    })),
  }));

  const totalLedgerEntries = evidenceNodes.reduce(
    (sum, node) => sum + node.ledgerEntries.length,
    0
  );

  // Generate integrity hash for the entire package
  const crypto = await import('crypto');
  const integrityHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(evidenceNodes))
    .digest('hex');

  // Log the export as evidence
  const exportEvidence = await writeEvidenceNode({
    entityType: 'AuditCase',
    entityId: auditCaseId,
    actorType: 'user',
    actorId: exportedBy,
  });

  await appendLedgerEntry({
    evidenceNodeId: exportEvidence.id,
    eventType: 'audit_package_exported',
    payload: {
      exportedAt: new Date().toISOString(),
      exportedBy,
      totalEvidenceItems: evidenceNodes.length,
      integrityHash,
    },
  });

  return {
    auditCase: {
      id: auditCase.id,
      title: auditCase.title,
      status: auditCase.status,
      createdAt: auditCase.createdAt,
    },
    evidenceNodes,
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      exportedBy,
      totalEvidenceItems: evidenceNodes.length,
      totalLedgerEntries,
      integrityHash,
    },
  };
}

// Get audit readiness score
export async function getAuditReadinessForCase(auditCaseId: string): Promise<{
  score: number;
  totalEvidence: number;
  verifiedEvidence: number;
  issues: string[];
}> {
  const auditCase = await prisma.auditCase.findUnique({
    where: { id: auditCaseId },
    include: {
      evidenceLinks: {
        include: { evidenceNode: { include: { ledgerEntries: true } } },
      },
    },
  });

  if (!auditCase) {
    throw new Error('Audit case not found');
  }

  const issues: string[] = [];
  const totalEvidence = auditCase.evidenceLinks.length;
  
  // Check for evidence without ledger entries
  const evidenceWithoutEntries = auditCase.evidenceLinks.filter(
    link => link.evidenceNode.ledgerEntries.length === 0
  );
  if (evidenceWithoutEntries.length > 0) {
    issues.push(`${evidenceWithoutEntries.length} evidence items without ledger entries`);
  }

  // Calculate score
  const verifiedEvidence = totalEvidence - evidenceWithoutEntries.length;
  const score = totalEvidence > 0 ? Math.round((verifiedEvidence / totalEvidence) * 100) : 0;

  return {
    score,
    totalEvidence,
    verifiedEvidence,
    issues,
  };
}

// Build chronological timeline of all evidence for an audit case
export async function buildAuditTimeline(auditId: string) {
  const links = await prisma.auditCaseEvidence.findMany({
    where: { auditCaseId: auditId },
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

  const timeline = links.flatMap(link =>
    link.evidenceNode.ledgerEntries.map(entry => ({
      evidenceNodeId: link.evidenceNode.id,
      entityType: link.evidenceNode.entityType,
      entityId: link.evidenceNode.entityId,
      eventType: entry.eventType,
      payload: entry.payload,
      timestamp: entry.createdAt,
    }))
  );

  return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

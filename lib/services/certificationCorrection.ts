import { prisma } from '../prisma';
import { writeEvidenceNode, appendLedgerEntry } from '../evidence';

export interface CorrectionChainItem {
  id: string;
  certificationType: string;
  issuingAuthority: string;
  issueDate: Date;
  expirationDate: Date;
  status: string;
  createdAt: Date;
  isCorrected: boolean;
  correctedAt: Date | null;
  correctedByUserId: string | null;
  correctionReason: string | null;
}

/**
 * Creates a corrected version of a certification.
 * The original record remains visible and is marked as corrected.
 * The new record is linked as the correction successor.
 */
export async function correctCertification(params: {
  originalCertificationId: string;
  correctionReason: string;
  correctedByUserId: string;
  newData: {
    certificationType?: string;
    issuingAuthority?: string;
    issueDate?: Date;
    expirationDate?: Date;
    status?: string;
    certificateMediaId?: string;
  };
}): Promise<{ original: any; corrected: any }> {
  const { originalCertificationId, correctionReason, correctedByUserId, newData } = params;

  // Fetch the original certification
  const original = await prisma.certification.findUnique({
    where: { id: originalCertificationId },
  });

  if (!original) {
    throw new Error('Original certification not found');
  }

  if (original.isCorrected) {
    throw new Error('This certification has already been corrected. Use the latest version in the chain.');
  }

  // Create corrected certification
  const corrected = await prisma.certification.create({
    data: {
      employeeId: original.employeeId,
      certificationType: newData.certificationType ?? original.certificationType,
      issuingAuthority: newData.issuingAuthority ?? original.issuingAuthority,
      issueDate: newData.issueDate ?? original.issueDate,
      expirationDate: newData.expirationDate ?? original.expirationDate,
      status: (newData.status as any) ?? original.status,
      certificateMediaId: newData.certificateMediaId ?? original.certificateMediaId,
      createdByUserId: correctedByUserId,
      createdAt: new Date(),
      isCorrected: false,
      correctedById: null,
      correctionReason: null,
      correctedAt: null,
      correctedByUserId: null,
    },
  });

  // Mark original as corrected and link to new version
  const updatedOriginal = await prisma.certification.update({
    where: { id: originalCertificationId },
    data: {
      isCorrected: true,
      correctedById: corrected.id,
      correctionReason,
      correctedAt: new Date(),
      correctedByUserId,
    },
  });

  // Create evidence trail for correction
  const evidence = await writeEvidenceNode({
    entityType: 'Certification',
    entityId: corrected.id,
    actorType: 'user',
    actorId: correctedByUserId,
  });

  await appendLedgerEntry({
    evidenceNodeId: evidence.id,
    eventType: 'certification_corrected',
    payload: {
      originalId: originalCertificationId,
      correctedId: corrected.id,
      reason: correctionReason,
      changes: newData,
    },
  });

  return { original: updatedOriginal, corrected };
}

/**
 * Gets the full correction chain for a certification.
 * Returns all versions from oldest to newest.
 */
export async function getCorrectionChain(certificationId: string): Promise<CorrectionChainItem[]> {
  // Find the root of the chain
  let current = await prisma.certification.findUnique({
    where: { id: certificationId },
  });

  if (!current) {
    throw new Error('Certification not found');
  }

  // Walk backwards to find the root
  const chain: CorrectionChainItem[] = [];
  const visited = new Set<string>();

  // First, find all predecessors
  while (current) {
    if (visited.has(current.id)) {
      throw new Error('Circular reference detected in correction chain');
    }
    visited.add(current.id);

    chain.unshift({
      id: current.id,
      certificationType: current.certificationType,
      issuingAuthority: current.issuingAuthority,
      issueDate: current.issueDate,
      expirationDate: current.expirationDate,
      status: current.status,
      createdAt: current.createdAt,
      isCorrected: current.isCorrected,
      correctedAt: current.correctedAt,
      correctedByUserId: current.correctedByUserId,
      correctionReason: current.correctionReason,
    });

    // Check if this certification was a correction of another
    const predecessors = await prisma.certification.findMany({
      where: { correctedById: current.id },
    });

    current = predecessors.length > 0 ? predecessors[0] : null;
  }

  // Now find all successors from the last item
  let lastItem = await prisma.certification.findUnique({
    where: { id: chain[chain.length - 1].id },
  });

  while (lastItem && lastItem.isCorrected && lastItem.correctedById) {
    const successor = await prisma.certification.findUnique({
      where: { id: lastItem.correctedById },
    });

    if (!successor || visited.has(successor.id)) break;

    visited.add(successor.id);
    chain.push({
      id: successor.id,
      certificationType: successor.certificationType,
      issuingAuthority: successor.issuingAuthority,
      issueDate: successor.issueDate,
      expirationDate: successor.expirationDate,
      status: successor.status,
      createdAt: successor.createdAt,
      isCorrected: successor.isCorrected,
      correctedAt: successor.correctedAt,
      correctedByUserId: successor.correctedByUserId,
      correctionReason: successor.correctionReason,
    });

    lastItem = successor;
  }

  return chain;
}

/**
 * Gets the current (latest) certification in a correction chain.
 */
export async function getCurrentCertification(certificationId: string) {
  const chain = await getCorrectionChain(certificationId);
  return chain[chain.length - 1];
}

/**
 * Gets certification state as of a specific date (point-in-time query).
 * Returns the version that was current at that date.
 */
export async function getCertificationAsOfDate(certificationId: string, asOfDate: Date) {
  const chain = await getCorrectionChain(certificationId);
  
  // Find the last version that existed before or at the specified date
  let result = chain[0];
  for (const item of chain) {
    if (item.createdAt <= asOfDate) {
      result = item;
    } else {
      break;
    }
  }
  
  return result;
}

/**
 * Gets all certifications for an employee as of a specific date.
 */
export async function getEmployeeCertificationsAsOfDate(
  employeeId: string,
  asOfDate: Date
): Promise<CorrectionChainItem[]> {
  // Get all certifications for the employee (including corrected ones)
  const allCerts = await prisma.certification.findMany({
    where: { employeeId },
    orderBy: { createdAt: 'asc' },
  });

  // Group by certification chains
  const chainRoots = new Set<string>();
  const processed = new Set<string>();

  for (const cert of allCerts) {
    if (processed.has(cert.id)) continue;

    // Find the root of this chain
    const chain = await getCorrectionChain(cert.id);
    const rootId = chain[0].id;
    
    if (!chainRoots.has(rootId)) {
      chainRoots.add(rootId);
      // Mark all items in this chain as processed
      chain.forEach(item => processed.add(item.id));
    }
  }

  // For each chain root, get the version as of the specified date
  const results: CorrectionChainItem[] = [];
  for (const rootId of chainRoots) {
    try {
      const versionAsOfDate = await getCertificationAsOfDate(rootId, asOfDate);
      // Only include if the certification existed at that date
      if (versionAsOfDate.createdAt <= asOfDate) {
        results.push(versionAsOfDate);
      }
    } catch (error) {
      // Skip if there's an error with this chain
      console.error(`Error getting certification ${rootId} as of date:`, error);
    }
  }

  return results;
}

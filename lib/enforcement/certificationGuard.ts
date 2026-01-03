// lib/enforcement/certificationGuard.ts
import { prisma } from '@/lib/prisma';
import { evaluateCertificationEnforcement } from '@/lib/services/enforcement';

/**
 * CERTIFICATION ENFORCEMENT GUARD
 * 
 * Blocks operations if employee lacks required certifications.
 * Used by:
 * - JHA acknowledgment
 * - Work window assignment
 * - Dispatch eligibility
 * - Incident personnel attachment
 */

export async function enforceCertificationRequirements(
  employeeId: string,
  requiredCerts: string[],
  triggeredBy: string
): Promise<void> {
  const certs = await prisma.certification.findMany({
    where: { employeeId },
    include: { enforcement: true },
  });

  const missing: string[] = [];
  const blocked: string[] = [];

  for (const required of requiredCerts) {
    const cert = certs.find(c => c.certificationType === required);
    
    if (!cert) {
      missing.push(required);
      continue;
    }

    // Evaluate enforcement state
    const { isBlocked } = await evaluateCertificationEnforcement(cert.id, triggeredBy);
    
    if (isBlocked) {
      blocked.push(required);
    }
  }

  if (missing.length > 0 || blocked.length > 0) {
    const reasons = [];
    if (missing.length > 0) reasons.push(`Missing: ${missing.join(', ')}`);
    if (blocked.length > 0) reasons.push(`Blocked: ${blocked.join(', ')}`);
    
    throw new ForbiddenError(
      `Employee ${employeeId} certification check failed: ${reasons.join(' | ')}`
    );
  }
}

/**
 * Check if employee is eligible for work (any blocked certs = ineligible)
 */
export async function isEmployeeEligible(employeeId: string): Promise<boolean> {
  const blockedCerts = await prisma.certification.count({
    where: {
      employeeId,
      enforcement: {
        isBlocked: true,
      },
    },
  });

  return blockedCerts === 0;
}

/**
 * Get blocked certifications for employee
 */
export async function getBlockedCertifications(employeeId: string) {
  return prisma.certification.findMany({
    where: {
      employeeId,
      enforcement: {
        isBlocked: true,
      },
    },
    include: {
      enforcement: true,
    },
  });
}

class ForbiddenError extends Error {
  status = 403;
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

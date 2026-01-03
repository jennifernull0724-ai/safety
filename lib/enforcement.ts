// lib/enforcement.ts
import { prisma } from './prisma';

/**
 * Certification enforcement service: checks if an employee is certified for a given type.
 * Throws if not certified or if cert is expired/revoked.
 */
export async function enforceCertification({ employeeId, certificationType }: { employeeId: string; certificationType: string }) {
  const cert = await prisma.certification.findFirst({
    where: {
      employeeId,
      certificationType,
      status: { in: ['valid', 'expiring'] },
      expirationDate: { gte: new Date() },
    },
  });
  if (!cert) {
    await logEnforcementAction({
      employeeId,
      certificationType,
      action: 'BLOCK',
      reason: 'No valid certification',
    });
    throw new Error('Certification enforcement failed: employee not certified or cert expired/revoked.');
  }
  await logEnforcementAction({
    employeeId,
    certificationType,
    action: 'ALLOW',
    reason: 'Certification valid',
  });
  return cert;
}

/**
 * Logs an enforcement action (block/allow) for auditability.
 */
export async function logEnforcementAction({ employeeId, certificationType, action, reason }: { employeeId: string; certificationType: string; action: 'BLOCK' | 'ALLOW'; reason: string }) {
  await prisma.enforcementAction.create({
    data: {
      actionType: 'certification_block',
      targetType: 'employee',
      targetId: employeeId,
      employeeId,
      certificationType,
      action,
      reason,
      triggeredBy: 'system',
      timestamp: new Date(),
    },
  });
}

/**
 * Block logic: fail closed if enforcement fails.
 */
export async function failClosed<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    // Optionally log or escalate
    throw new Error('Enforcement failed: system is in fail-closed state.');
  }
}

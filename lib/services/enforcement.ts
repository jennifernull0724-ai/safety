import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

export async function evaluateCertificationEnforcement(certificationId: string, triggeredBy: string) {
  const cert = await prisma.certification.findUnique({
    where: { id: certificationId },
  });

  if (!cert) throw new Error('Certification not found');

  const now = new Date();
  let isBlocked = false;
  let blockedReason: string | null = null;

  if (cert.status === 'FAIL') {
    isBlocked = true;
    blockedReason = 'Certification status: FAIL';
  } else if (cert.status === 'INCOMPLETE') {
    isBlocked = true;
    blockedReason = 'Certification incomplete - missing required proof';
  } else if (cert.expirationDate && cert.expirationDate < now && !cert.isNonExpiring) {
    isBlocked = true;
    blockedReason = `Certification expired on ${cert.expirationDate.toISOString().split('T')[0]}`;
  }

  await prisma.certificationEnforcement.upsert({
    where: { certificationId },
    create: {
      certificationId,
      isBlocked,
      blockedReason,
    },
    update: {
      isBlocked,
      blockedReason,
      evaluatedAt: now,
    },
  });

  if (isBlocked) {
    await prisma.enforcementAction.create({
      data: {
        actionType: 'certification_block',
        targetType: 'certification',
        targetId: certificationId,
        reason: blockedReason!,
        triggeredBy,
      },
    });
  }

  return { isBlocked, blockedReason };
}

export async function enforceEmployeeEligibility(employeeId: string, requiredCerts: string[]) {
  const certs = await prisma.certification.findMany({
    where: { employeeId },
    include: { enforcement: true },
  });

  const blocked: string[] = [];

  for (const required of requiredCerts) {
    const cert = certs.find(c => c.certificationType === required);
    
    if (!cert || cert.enforcement?.isBlocked) {
      blocked.push(required);
    }
  }

  if (blocked.length > 0) {
    await prisma.enforcementAction.create({
      data: {
        actionType: 'work_window_block',
        targetType: 'employee',
        targetId: employeeId,
        reason: `Missing or blocked certifications: ${blocked.join(', ')}`,
        triggeredBy: 'system',
      },
    });

    throw new Error(`Employee not eligible: ${blocked.join(', ')}`);
  }
}

export async function blockJHAAcknowledgment(employeeId: string, jhaId: string) {
  const certs = await prisma.certification.findMany({
    where: { employeeId },
    include: { enforcement: true },
  });

  const blockedCerts = certs.filter(c => c.enforcement?.isBlocked);

  if (blockedCerts.length > 0) {
    await prisma.enforcementAction.create({
      data: {
        actionType: 'jha_block',
        targetType: 'jha',
        targetId: jhaId,
        reason: `Employee ${employeeId} has ${blockedCerts.length} blocked certification(s)`,
        triggeredBy: 'system',
      },
    });

    throw new Error('JHA acknowledgment blocked due to certification enforcement');
  }
}

export async function recordEnforcementAction(params: {
  type: string;
  targetId: string;
  reason: string;
  triggeredBy?: string;
}) {
  await prisma.enforcementAction.create({
    data: {
      actionType: params.type,
      targetType: 'unknown',
      targetId: params.targetId,
      reason: params.reason,
      triggeredBy: params.triggeredBy || 'system',
    },
  });
}

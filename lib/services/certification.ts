import { prisma } from '../prisma';

export type CertificationStatus = 'VALID' | 'EXPIRED' | 'REVOKED' | 'PENDING';

export interface CertificationSummary {
  employeeId: string;
  totalCertifications: number;
  validCount: number;
  expiredCount: number;
  revokedCount: number;
  expiringWithin30Days: number;
  certifications: Array<{
    id: string;
    certType: string;
    status: CertificationStatus;
    expirationDate: Date | null;
    daysUntilExpiration: number | null;
  }>;
}

// Get certification summary for an employee
export async function getCertificationSummary(employeeId: string): Promise<CertificationSummary> {
  const certifications = await prisma.certification.findMany({
    where: { employeeId },
    orderBy: { expirationDate: 'asc' },
  });

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const certDetails = certifications.map(cert => {
    const daysUntilExpiration = cert.expirationDate
      ? Math.ceil((cert.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      id: cert.id,
      certType: cert.certType,
      status: cert.status as CertificationStatus,
      expirationDate: cert.expirationDate,
      daysUntilExpiration,
    };
  });

  return {
    employeeId,
    totalCertifications: certifications.length,
    validCount: certifications.filter(c => c.status === 'VALID').length,
    expiredCount: certifications.filter(c => c.status === 'EXPIRED').length,
    revokedCount: certifications.filter(c => c.status === 'REVOKED').length,
    expiringWithin30Days: certifications.filter(c => 
      c.status === 'VALID' && c.expirationDate && c.expirationDate <= thirtyDaysFromNow
    ).length,
    certifications: certDetails,
  };
}

// Check if employee has all required certifications
export async function hasRequiredCertifications(
  employeeId: string,
  requiredCertTypes: string[]
): Promise<{ valid: boolean; missing: string[] }> {
  const certifications = await prisma.certification.findMany({
    where: {
      employeeId,
      status: 'VALID',
      certType: { in: requiredCertTypes },
      OR: [
        { expirationDate: null },
        { expirationDate: { gt: new Date() } },
      ],
    },
  });

  const validCertTypes = new Set(certifications.map(c => c.certType));
  const missing = requiredCertTypes.filter(type => !validCertTypes.has(type));

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Get employees with expiring certifications
export async function getExpiringCertifications(daysAhead: number = 30): Promise<Array<{
  certification: { id: string; certType: string; expirationDate: Date };
  employee: { id: string; firstName: string; lastName: string; email: string | null };
  daysUntilExpiration: number;
}>> {
  const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const now = new Date();

  const certifications = await prisma.certification.findMany({
    where: {
      status: 'VALID',
      expirationDate: {
        gte: now,
        lte: futureDate,
      },
    },
    include: { employee: true },
    orderBy: { expirationDate: 'asc' },
  });

  return certifications.map(cert => ({
    certification: {
      id: cert.id,
      certType: cert.certType,
      expirationDate: cert.expirationDate!,
    },
    employee: {
      id: cert.employee.id,
      firstName: cert.employee.firstName,
      lastName: cert.employee.lastName,
      email: cert.employee.email,
    },
    daysUntilExpiration: Math.ceil(
      (cert.expirationDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));
}

// Revoke a certification with evidence
export async function revokeCertification(
  certId: string,
  reason: string,
  revokedBy: string
): Promise<{ success: boolean; certification: unknown }> {
  const certification = await prisma.certification.update({
    where: { id: certId },
    data: {
      status: 'REVOKED',
      revokedAt: new Date(),
      revokedReason: reason,
    },
  });

  return { success: true, certification };
}

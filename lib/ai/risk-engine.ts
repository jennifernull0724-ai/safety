import { prisma } from '../prisma';

// AI Risk Engine - Advisory Only (Non-blocking)
// All AI outputs are labeled as advisory and do not affect system enforcement

export interface RiskAssessment {
  entityType: string;
  entityId: string;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: RiskFactor[];
  recommendation: string;
  isAdvisoryOnly: true; // Always true - AI never blocks
  generatedAt: Date;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  value: number;
  contribution: number;
}

// Calculate certification risk for an employee
export async function calculateCertificationRisk(employeeId: string): Promise<RiskAssessment> {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { Certification: true },
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  const factors: RiskFactor[] = [];
  const now = new Date();

  // Factor 1: Expired certifications
  const expiredCount = employee.Certification.filter(c => c.status === 'EXPIRED').length;
  factors.push({
    factor: 'Expired Certifications',
    weight: 0.4,
    value: expiredCount,
    contribution: Math.min(expiredCount * 20, 40),
  });

  // Factor 2: Certifications expiring soon (30 days)
  const expiringCount = employee.Certification.filter(c => 
    c.status === 'VALID' && 
    c.expirationDate && 
    c.expirationDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000
  ).length;
  factors.push({
    factor: 'Certifications Expiring Soon',
    weight: 0.3,
    value: expiringCount,
    contribution: Math.min(expiringCount * 15, 30),
  });

  // Factor 3: Revoked certifications (historical)
  const revokedCount = employee.Certification.filter(c => c.status === 'REVOKED').length;
  factors.push({
    factor: 'Revoked Certifications',
    weight: 0.3,
    value: revokedCount,
    contribution: Math.min(revokedCount * 25, 30),
  });

  const riskScore = Math.min(factors.reduce((sum, f) => sum + f.contribution, 0), 100);
  const riskLevel = riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  return {
    entityType: 'Employee',
    entityId: employeeId,
    riskScore,
    riskLevel,
    factors,
    recommendation: generateRecommendation(riskLevel, factors),
    isAdvisoryOnly: true,
    generatedAt: new Date(),
  };
}

// Calculate near-miss clustering risk
export async function calculateNearMissClusterRisk(organizationId: string): Promise<RiskAssessment> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const nearMisses = await prisma.nearMiss.findMany({
    where: {
      organizationId,
      reportedAt: { gte: thirtyDaysAgo },
    },
  });

  const factors: RiskFactor[] = [];

  // Factor 1: Volume of near misses
  factors.push({
    factor: 'Near Miss Volume (30 days)',
    weight: 0.4,
    value: nearMisses.length,
    contribution: Math.min(nearMisses.length * 5, 40),
  });

  // Factor 2: Category clustering (if same categories repeat)
  const categoryCounts = nearMisses.reduce((acc, nm) => {
    const cat = nm.category || 'UNCATEGORIZED';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const maxCategoryCount = Math.max(...(Object.values(categoryCounts) as number[]), 0);
  factors.push({
    factor: 'Category Clustering',
    weight: 0.3,
    value: maxCategoryCount,
    contribution: Math.min(maxCategoryCount * 10, 30),
  });

  // Factor 3: Severity distribution
  const highSeverityCount = nearMisses.filter(nm => 
    nm.severity === 'HIGH' || nm.severity === 'CRITICAL'
  ).length;
  factors.push({
    factor: 'High Severity Events',
    weight: 0.3,
    value: highSeverityCount,
    contribution: Math.min(highSeverityCount * 15, 30),
  });

  const riskScore = Math.min(factors.reduce((sum, f) => sum + f.contribution, 0), 100);
  const riskLevel = riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  return {
    entityType: 'Organization',
    entityId: organizationId,
    riskScore,
    riskLevel,
    factors,
    recommendation: generateRecommendation(riskLevel, factors),
    isAdvisoryOnly: true,
    generatedAt: new Date(),
  };
}

// Calculate fatigue risk for work window
export async function calculateFatigueRisk(employeeId: string, daysBack: number = 7): Promise<RiskAssessment> {
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  
  // Get work windows the employee was part of
  const workWindows = await prisma.workWindow.findMany({
    where: {
      startTime: { gte: startDate },
    },
  });

  const factors: RiskFactor[] = [];

  // Factor 1: Total hours worked
  const totalHours = workWindows.reduce((sum, w) => {
    if (!w.endTime) return sum;
    return sum + (w.endTime.getTime() - w.startTime.getTime()) / (1000 * 60 * 60);
  }, 0);

  factors.push({
    factor: `Hours Worked (${daysBack} days)`,
    weight: 0.5,
    value: totalHours,
    contribution: totalHours > 60 ? 50 : totalHours > 40 ? 30 : totalHours > 20 ? 15 : 5,
  });

  // Factor 2: Consecutive days
  const uniqueDays = new Set(workWindows.map(w => w.startTime.toDateString())).size;
  factors.push({
    factor: 'Days Worked',
    weight: 0.3,
    value: uniqueDays,
    contribution: uniqueDays >= 7 ? 30 : uniqueDays >= 5 ? 20 : uniqueDays >= 3 ? 10 : 5,
  });

  // Factor 3: Night shifts
  const nightShifts = workWindows.filter(w => {
    const hour = w.startTime.getHours();
    return hour >= 22 || hour < 6;
  }).length;
  factors.push({
    factor: 'Night Shifts',
    weight: 0.2,
    value: nightShifts,
    contribution: Math.min(nightShifts * 10, 20),
  });

  const riskScore = Math.min(factors.reduce((sum, f) => sum + f.contribution, 0), 100);
  const riskLevel = riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  return {
    entityType: 'Employee',
    entityId: employeeId,
    riskScore,
    riskLevel,
    factors,
    recommendation: generateRecommendation(riskLevel, factors),
    isAdvisoryOnly: true,
    generatedAt: new Date(),
  };
}

function generateRecommendation(riskLevel: string, factors: RiskFactor[]): string {
  const topFactor = factors.sort((a, b) => b.contribution - a.contribution)[0];
  
  switch (riskLevel) {
    case 'CRITICAL':
      return `ADVISORY: Critical risk detected. Primary factor: ${topFactor.factor}. Immediate review recommended.`;
    case 'HIGH':
      return `ADVISORY: High risk detected. Consider addressing ${topFactor.factor}.`;
    case 'MEDIUM':
      return `ADVISORY: Moderate risk. Monitor ${topFactor.factor}.`;
    default:
      return `ADVISORY: Risk levels acceptable. Continue normal operations.`;
  }
}

// Ensure AI insights are properly labeled as advisory
export function wrapAsAdvisory<T>(insight: T): T & { aiDisclaimer: string } {
  return {
    ...insight,
    aiDisclaimer: 'This is an AI-generated advisory insight. It does not affect system enforcement or block any operations. Human review is recommended.',
  };
}

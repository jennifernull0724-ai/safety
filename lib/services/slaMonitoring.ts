import { prisma } from '../prisma';

/**
 * SLA MONITORING SERVICE
 * 
 * Tracks uptime and calculates service credits based on:
 * - 99.0-99.49% → 5% credit
 * - 98.0-98.99% → 10% credit
 * - <98.0% → 15% credit
 * 
 * Target: 99.5% monthly uptime
 */

export interface UptimeData {
  month: string;
  uptimePercent: number;
  downtimeMinutes: number;
}

/**
 * Calculate SLA credit percentage based on uptime
 */
export function calculateSLACredit(uptimePercent: number): number {
  if (uptimePercent >= 99.5) return 0;
  if (uptimePercent >= 99.0) return 5;
  if (uptimePercent >= 98.0) return 10;
  return 15;
}

/**
 * Record monthly uptime metric for an organization
 */
export async function recordUptimeMetric(
  organizationId: string,
  data: UptimeData
) {
  const creditPercent = calculateSLACredit(data.uptimePercent);
  const creditAmount = creditPercent / 100;

  const metric = await prisma.uptimeMetric.upsert({
    where: {
      organizationId_month: {
        organizationId,
        month: data.month,
      },
    },
    create: {
      organizationId,
      month: data.month,
      uptimePercent: data.uptimePercent,
      downtimeMinutes: data.downtimeMinutes,
      slaCreditsEarned: creditAmount,
    },
    update: {
      uptimePercent: data.uptimePercent,
      downtimeMinutes: data.downtimeMinutes,
      slaCreditsEarned: creditAmount,
    },
  });

  // Update organization's total SLA credits owed
  if (creditAmount > 0) {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        slaCreditsOwed: {
          increment: creditAmount,
        },
      },
    });
  }

  return metric;
}

/**
 * Get SLA compliance status for an organization
 */
export async function getSLAStatus(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      slaCreditsOwed: true,
      uptimeMetrics: {
        orderBy: { month: 'desc' },
        take: 12,
      },
    },
  });

  return {
    totalCreditsOwed: organization?.slaCreditsOwed || 0,
    recentMetrics: organization?.uptimeMetrics || [],
  };
}

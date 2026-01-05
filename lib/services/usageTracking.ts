import { prisma } from '../prisma';
import { format } from 'date-fns';

/**
 * USAGE TRACKING SERVICE
 * 
 * Monitors usage against documented limits:
 * - QR scans: "unlimited" but flagged if excessive
 * - AI events: 2,000,000/year
 * - Employee-days: 3,650,000/year (10,000 employees × 365 days)
 * - Incidents: 1,000,000/year
 */

export type MetricType = 'qr_scans_daily' | 'ai_events_annual' | 'employee_days_annual' | 'incidents_annual';

interface UsageThresholds {
  qr_scans_daily: number;
  ai_events_annual: number;
  employee_days_annual: number;
  incidents_annual: number;
}

// Warning thresholds (90% of documented limits)
const THRESHOLDS: UsageThresholds = {
  qr_scans_daily: 100000, // Flag if >100k daily scans
  ai_events_annual: 1800000, // 90% of 2M
  employee_days_annual: 3285000, // 90% of 3.65M
  incidents_annual: 900000, // 90% of 1M
};

/**
 * Record usage metric and check thresholds
 */
export async function recordUsage(
  organizationId: string,
  metricType: MetricType,
  count: number
) {
  const now = new Date();
  const period = metricType === 'qr_scans_daily' 
    ? format(now, 'yyyy-MM-dd')
    : format(now, 'yyyy');

  const threshold = THRESHOLDS[metricType];
  const exceededThreshold = count >= threshold;

  const metric = await prisma.usageMetric.upsert({
    where: {
      organizationId_metricType_period: {
        organizationId,
        metricType,
        period,
      },
    },
    create: {
      organizationId,
      metricType,
      period,
      count,
      exceededThreshold,
      flaggedAt: exceededThreshold ? now : null,
    },
    update: {
      count,
      exceededThreshold,
      flaggedAt: exceededThreshold ? now : null,
    },
  });

  // Log excessive usage to immutable ledger
  if (exceededThreshold) {
    await prisma.immutableEventLedger.create({
      data: {
        eventType: 'usage.threshold_exceeded',
        entityType: 'organization',
        entityId: organizationId,
        actorId: 'system',
        actorType: 'system',
        metadata: {
          metricType,
          period,
          count,
          threshold,
        },
      },
    });
  }

  return metric;
}

/**
 * Increment usage counter atomically
 */
export async function incrementUsage(
  organizationId: string,
  metricType: MetricType,
  incrementBy: number = 1
) {
  const now = new Date();
  const period = metricType === 'qr_scans_daily' 
    ? format(now, 'yyyy-MM-dd')
    : format(now, 'yyyy');

  // Get current count
  const existing = await prisma.usageMetric.findUnique({
    where: {
      organizationId_metricType_period: {
        organizationId,
        metricType,
        period,
      },
    },
  });

  const newCount = (existing?.count || 0) + incrementBy;
  
  return recordUsage(organizationId, metricType, newCount);
}

/**
 * Get current usage status for an organization
 */
export async function getUsageStatus(organizationId: string) {
  const currentYear = format(new Date(), 'yyyy');
  const today = format(new Date(), 'yyyy-MM-dd');

  const [qrScans, aiEvents, employeeDays, incidents] = await Promise.all([
    prisma.usageMetric.findUnique({
      where: {
        organizationId_metricType_period: {
          organizationId,
          metricType: 'qr_scans_daily',
          period: today,
        },
      },
    }),
    prisma.usageMetric.findUnique({
      where: {
        organizationId_metricType_period: {
          organizationId,
          metricType: 'ai_events_annual',
          period: currentYear,
        },
      },
    }),
    prisma.usageMetric.findUnique({
      where: {
        organizationId_metricType_period: {
          organizationId,
          metricType: 'employee_days_annual',
          period: currentYear,
        },
      },
    }),
    prisma.usageMetric.findUnique({
      where: {
        organizationId_metricType_period: {
          organizationId,
          metricType: 'incidents_annual',
          period: currentYear,
        },
      },
    }),
  ]);

  return {
    qrScansToday: qrScans?.count || 0,
    qrScansExceeded: qrScans?.exceededThreshold || false,
    aiEventsYTD: aiEvents?.count || 0,
    aiEventsExceeded: aiEvents?.exceededThreshold || false,
    employeeDaysYTD: employeeDays?.count || 0,
    employeeDaysExceeded: employeeDays?.exceededThreshold || false,
    incidentsYTD: incidents?.count || 0,
    incidentsExceeded: incidents?.exceededThreshold || false,
  };
}

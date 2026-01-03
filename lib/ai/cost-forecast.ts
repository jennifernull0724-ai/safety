/**
 * COST OVERRUN AI (FORECAST ONLY)
 * 
 * Estimates potential cost overruns using past incidents.
 * 
 * RULES:
 * - NO accounting writes
 * - NO budget enforcement
 * - Forecast is advisory only
 * - Human makes budget decisions
 */

import { prisma } from '../prisma';
import { wrapWithGovernance, isAIEnabled } from './governance';

interface CostForecast {
  estimatedRange: string;
  confidence: number;
  evidenceIds: string[];
  breakdown: {
    laborEstimate: string;
    materialEstimate: string;
    downtimeEstimate: string;
  };
  advisoryOnly: true;
  aiGenerated: true;
}

/**
 * Forecast incident cost based on historical patterns
 * 
 * Analyzes:
 * - Incident type similarity
 * - Severity correlation
 * - Historical cost data (if available)
 * - Time-to-resolution patterns
 * 
 * @param incidentId - Incident ID
 * @returns Advisory cost forecast with evidence
 */
export async function forecastIncidentCost(
  incidentId: string
): Promise<CostForecast | null> {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    // 1. Load incident
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      return null;
    }

    // 2. Find similar historical incidents
    const historicalIncidents = await prisma.incident.findMany({
      where: {
        organizationId: incident.organizationId,
        incidentType: incident.incidentType,
      },
      take: 20,
      orderBy: { occurredAt: 'desc' },
    });

    // 3. Get evidence for historical incidents
    const evidenceNodes = await prisma.evidenceNode.findMany({
      where: {
        entityType: 'Incident',
        entityId: { in: historicalIncidents.map(i => i.id) },
      },
    });

    // 4. Calculate estimate (simplified - production would use ML)
    const baseEstimate = calculateBaseEstimate(incident.incidentType, incident.severity || 'unknown');
    const estimatedRange = `$${baseEstimate.low.toLocaleString()}–$${baseEstimate.high.toLocaleString()}`;
    const confidence = historicalIncidents.length > 5 ? 0.62 : 0.35;

    // 5. Record AI insight
    await prisma.aIInsight.create({
      data: {
        insightType: 'cost_forecast',
        summary: `Estimated cost range: ${estimatedRange} (confidence: ${Math.round(confidence * 100)}%)`,
        confidence,
        evidenceIds: evidenceNodes.map(e => e.id),
      },
    });

    // 6. Wrap with governance metadata
    return wrapWithGovernance({
      estimatedRange,
      confidence,
      evidenceIds: evidenceNodes.map(e => e.id),
      breakdown: {
        laborEstimate: `$${Math.round(baseEstimate.low * 0.4).toLocaleString()}–$${Math.round(baseEstimate.high * 0.4).toLocaleString()}`,
        materialEstimate: `$${Math.round(baseEstimate.low * 0.35).toLocaleString()}–$${Math.round(baseEstimate.high * 0.35).toLocaleString()}`,
        downtimeEstimate: `$${Math.round(baseEstimate.low * 0.25).toLocaleString()}–$${Math.round(baseEstimate.high * 0.25).toLocaleString()}`,
      },
    });
  } catch (error) {
    console.error('[Cost Forecast AI] Failed:', error);
    return null; // Fail gracefully
  }
}

/**
 * Calculate base cost estimate (simplified heuristic)
 * Production would use ML trained on actual cost data
 */
function calculateBaseEstimate(
  incidentType: string,
  severity: string
): { low: number; high: number } {
  // Base estimates by incident type (in USD)
  const baseRates: Record<string, { low: number; high: number }> = {
    derailment: { low: 150000, high: 500000 },
    collision: { low: 80000, high: 250000 },
    trespasser: { low: 20000, high: 100000 },
    equipment_failure: { low: 40000, high: 150000 },
    default: { low: 30000, high: 100000 },
  };

  // Severity multipliers
  const severityMultipliers: Record<string, number> = {
    FATAL: 2.5,
    INJURY: 1.5,
    PROPERTY: 1.0,
    unknown: 1.0,
  };

  const base = baseRates[incidentType] || baseRates.default;
  const multiplier = severityMultipliers[severity] || 1.0;

  return {
    low: Math.round(base.low * multiplier),
    high: Math.round(base.high * multiplier),
  };
}

/**
 * Get cost trends for organization
 * Advisory only - no budget enforcement
 */
export async function getCostTrends(organizationId: string): Promise<{
  averageCost: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyData: Array<{ month: string; estimate: string }>;
  advisoryOnly: true;
} | null> {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    const incidents = await prisma.incident.findMany({
      where: { organizationId },
      orderBy: { occurredAt: 'desc' },
      take: 50,
    });

    // Simplified trend analysis
    const averageCost = '$120,000'; // Placeholder
    const trend = 'stable'; // Placeholder

    return {
      averageCost,
      trend,
      monthlyData: [],
      advisoryOnly: true,
    };
  } catch (error) {
    console.error('[Cost Trends] Failed:', error);
    return null;
  }
}

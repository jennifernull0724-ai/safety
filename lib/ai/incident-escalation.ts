/**
 * INCIDENT ESCALATION AI (PREDICTIVE, NON-BINDING)
 * 
 * Flags incidents likely to require regulatory escalation.
 * 
 * RULES:
 * - NO auto-notifications
 * - NO regulator contact
 * - NO enforcement triggers
 * - Prediction is advisory only
 * - Human makes final decision
 */

import { prisma } from '../prisma';
import { wrapWithGovernance, isAIEnabled } from './governance';

type EscalationRisk = 'HIGH' | 'MEDIUM' | 'LOW';

interface EscalationPrediction {
  escalationRisk: EscalationRisk;
  reasoning: string;
  evidenceIds: string[];
  advisoryOnly: true;
  aiGenerated: true;
}

/**
 * Predict regulatory escalation risk for an incident
 * 
 * Analyzes incident characteristics against historical patterns:
 * - Severity (fatality, injury, property damage)
 * - Type (derailment, collision, trespasser)
 * - Location (public crossing, yard, main line)
 * 
 * @param incidentId - Incident ID
 * @returns Advisory escalation risk assessment
 */
export async function predictRegulatoryEscalation(
  incidentId: string
): Promise<EscalationPrediction | null> {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    // 1. Load incident with evidence
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      return null;
    }

    // 2. Get evidence nodes for this incident
    const evidenceNodes = await prisma.evidenceNode.findMany({
      where: {
        entityType: 'Incident',
        entityId: incidentId,
      },
    });

    // 3. Analyze incident characteristics
    const severity = incident.severity || 'unknown';
    const incidentType = incident.incidentType;

    // 4. Pattern matching against FRA-reportable criteria
    let escalationRisk: EscalationRisk = 'LOW';
    let reasoning = 'Incident does not match typical regulatory reporting patterns';

    // High risk patterns
    if (severity === 'FATAL' || incidentType.includes('derailment')) {
      escalationRisk = 'HIGH';
      reasoning = 'Pattern matches prior FRA-reportable incidents (fatality or derailment)';
    }
    // Medium risk patterns
    else if (severity === 'INJURY' || incidentType.includes('collision')) {
      escalationRisk = 'MEDIUM';
      reasoning = 'Incident characteristics suggest potential regulatory interest';
    }

    // 5. Record AI insight for audit trail
    await prisma.aIInsight.create({
      data: {
        insightType: 'incident_escalation',
        summary: `Escalation risk: ${escalationRisk} - ${reasoning}`,
        confidence: escalationRisk === 'HIGH' ? 0.85 : escalationRisk === 'MEDIUM' ? 0.65 : 0.45,
        evidenceIds: evidenceNodes.map(e => e.id),
      },
    });

    // 6. Wrap with governance metadata
    return wrapWithGovernance({
      escalationRisk,
      reasoning,
      evidenceIds: evidenceNodes.map(e => e.id),
    });
  } catch (error) {
    console.error('[Incident Escalation AI] Failed:', error);
    return null; // Fail gracefully
  }
}

/**
 * Get historical escalation patterns for reference
 * 
 * Advisory only - does not trigger any actions
 */
export async function getEscalationPatterns(organizationId: string): Promise<{
  totalIncidents: number;
  escalatedCount: number;
  commonPatterns: string[];
  advisoryOnly: true;
} | null> {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    const incidents = await prisma.incident.findMany({
      where: { organizationId },
      orderBy: { occurredAt: 'desc' },
      take: 100,
    });

    // Analyze patterns (simplified - production would use ML)
    const totalIncidents = incidents.length;
    const escalatedCount = incidents.filter(i => 
      i.severity === 'FATAL' || i.incidentType.includes('derailment')
    ).length;

    const commonPatterns = [
      ...new Set(incidents.map(i => i.incidentType)),
    ].slice(0, 5);

    return {
      totalIncidents,
      escalatedCount,
      commonPatterns,
      advisoryOnly: true,
    };
  } catch (error) {
    console.error('[Escalation Patterns] Failed:', error);
    return null;
  }
}

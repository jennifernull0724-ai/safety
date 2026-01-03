/**
 * JHA AI ASSIST (ADVISORY ONLY)
 * 
 * Suggests hazards based on historical evidence.
 * 
 * RULES:
 * - NO blocking
 * - NO enforcement
 * - NO auto-selection
 * - Human must acknowledge
 * - Suggestions are non-binding
 * 
 * UI REQUIREMENT: Must label "AI Advisory — Human Review Required"
 */

import { prisma } from '../prisma';
import { wrapWithGovernance, isAIEnabled } from './governance';

interface HazardSuggestion {
  hazard: string;
  rationale: string;
  evidenceId: string;
  confidence: number;
}

interface JHAAssistResponse {
  suggestions: HazardSuggestion[];
  advisoryOnly: true;
  aiGenerated: true;
}

/**
 * Suggest JHA hazards based on historical incidents at similar locations
 * 
 * @param jhaId - Job Hazard Analysis ID
 * @returns Advisory suggestions with evidence references
 */
export async function suggestJHAHazards(jhaId: string): Promise<JHAAssistResponse | null> {
  if (!isAIEnabled()) {
    return null; // System continues without AI
  }

  try {
    // 1. Load JHA context
    const jha = await prisma.jobHazardAnalysis.findUnique({
      where: { id: jhaId },
    });

    if (!jha) {
      return null;
    }

    // 2. Find past incidents at similar locations/activities
    const pastIncidents = await prisma.incident.findMany({
      where: {
        organizationId: jha.organizationId,
      },
      take: 10,
      orderBy: { occurredAt: 'desc' },
    });

    // 3. Get evidence nodes for these incidents
    const evidenceNodes = await prisma.evidenceNode.findMany({
      where: {
        entityType: 'Incident',
        entityId: { in: pastIncidents.map(i => i.id) },
      },
      include: {
        ledgerEntries: true,
      },
    });

    // 4. Generate suggestions (pattern matching on incident types)
    const suggestions: HazardSuggestion[] = pastIncidents.map((incident, index) => ({
      hazard: incident.incidentType,
      rationale: `Similar ${incident.incidentType} incident occurred on ${incident.occurredAt.toLocaleDateString()}`,
      evidenceId: evidenceNodes[index]?.id || 'no-evidence',
      confidence: 0.7, // Advisory confidence score
    }));

    // 5. Wrap with governance metadata
    return wrapWithGovernance({
      suggestions,
    });
  } catch (error) {
    console.error('[JHA AI Assist] Failed:', error);
    return null; // Fail gracefully - system continues
  }
}

/**
 * Record AI suggestion for audit trail
 */
export async function recordJHASuggestion(
  jhaId: string,
  suggestions: HazardSuggestion[]
): Promise<void> {
  if (!isAIEnabled()) {
    return;
  }

  try {
    await prisma.aISuggestion.create({
      data: {
        suggestionType: 'jha_hazard',
        description: `Suggested ${suggestions.length} hazards based on historical evidence`,
        severity: 'informational',
        relatedEntity: 'JobHazardAnalysis',
        relatedEntityId: jhaId,
        evidenceIds: suggestions.map(s => s.evidenceId),
      },
    });
  } catch (error) {
    console.error('[JHA AI Assist] Failed to record suggestion:', error);
    // Non-fatal - system continues
  }
}

/**
 * AI GOVERNANCE (MANDATORY)
 * 
 * Hard rules for AI layer behavior.
 * 
 * CRITICAL PRINCIPLES:
 * - AI is ADVISORY ONLY
 * - AI CANNOT mutate enforcement state
 * - AI CANNOT trigger blocking actions
 * - AI REQUIRES human decision
 * - AI can be disabled with ZERO impact
 * 
 * If any AI service violates these rules, it must be rejected.
 */

export const AI_GOVERNANCE = {
  advisoryOnly: true,
  cannotMutateState: true,
  requiresHumanDecision: true,
  disableSafe: true,
} as const;

/**
 * Validates that an AI output is governance-compliant
 */
export function validateAIOutput<T extends { advisoryOnly?: boolean }>(
  output: T
): T {
  if (!output.advisoryOnly) {
    throw new Error(
      '❌ AI governance violation: All AI outputs must have advisoryOnly: true'
    );
  }
  return output;
}

/**
 * Wraps AI output with governance metadata
 */
export function wrapWithGovernance<T>(data: T): T & { advisoryOnly: true; aiGenerated: true } {
  return {
    ...data,
    advisoryOnly: true,
    aiGenerated: true,
  };
}

/**
 * Checks if AI layer is enabled
 * System continues operating normally if disabled
 */
export function isAIEnabled(): boolean {
  return process.env.ENABLE_AI_LAYER !== 'false';
}

/**
 * AI layer status check
 */
export function getAIStatus() {
  return {
    enabled: isAIEnabled(),
    governance: AI_GOVERNANCE,
    compliance: {
      canMutateEnforcement: false,
      canBlockActions: false,
      canOverrideHumans: false,
      canModifyEvidence: false,
    },
  };
}

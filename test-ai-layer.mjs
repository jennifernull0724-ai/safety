/**
 * AI LAYER TEST SUITE
 * 
 * Validates AI governance compliance and functionality
 */

import { AI_GOVERNANCE, validateAIOutput, wrapWithGovernance, isAIEnabled, getAIStatus } from './lib/ai/governance';
import { suggestJHAHazards } from './lib/ai/jha-assist';
import { predictRegulatoryEscalation } from './lib/ai/incident-escalation';
import { forecastIncidentCost } from './lib/ai/cost-forecast';
import { prisma } from './lib/prisma';

async function testAILayer() {
  console.log('🧪 Testing AI Layer Governance...\n');

  // Test 1: AI Governance Constants
  console.log('Test 1: AI Governance Rules');
  console.log('  advisoryOnly:', AI_GOVERNANCE.advisoryOnly);
  console.log('  cannotMutateState:', AI_GOVERNANCE.cannotMutateState);
  console.log('  requiresHumanDecision:', AI_GOVERNANCE.requiresHumanDecision);
  console.log('  disableSafe:', AI_GOVERNANCE.disableSafe);
  
  if (AI_GOVERNANCE.advisoryOnly && 
      AI_GOVERNANCE.cannotMutateState && 
      AI_GOVERNANCE.requiresHumanDecision && 
      AI_GOVERNANCE.disableSafe) {
    console.log('  ✅ PASS: All governance rules enforced\n');
  } else {
    console.log('  ❌ FAIL: Governance rules violated\n');
  }

  // Test 2: Validate AI Output
  console.log('Test 2: AI Output Validation');
  try {
    validateAIOutput({ data: 'test', advisoryOnly: false });
    console.log('  ❌ FAIL: Should have rejected non-advisory output\n');
  } catch (error) {
    if (error.message.includes('advisoryOnly: true')) {
      console.log('  ✅ PASS: Rejected non-advisory output\n');
    }
  }

  // Test 3: Wrap with Governance
  console.log('Test 3: Governance Wrapper');
  const wrapped = wrapWithGovernance({ test: 'data' });
  if (wrapped.advisoryOnly && wrapped.aiGenerated) {
    console.log('  ✅ PASS: Governance metadata added\n');
  } else {
    console.log('  ❌ FAIL: Missing governance metadata\n');
  }

  // Test 4: AI Status Check
  console.log('Test 4: AI Status Check');
  const status = getAIStatus();
  console.log('  Enabled:', status.enabled);
  console.log('  Can mutate enforcement:', status.compliance.canMutateEnforcement);
  console.log('  Can block actions:', status.compliance.canBlockActions);
  console.log('  Can override humans:', status.compliance.canOverrideHumans);
  console.log('  Can modify evidence:', status.compliance.canModifyEvidence);
  
  if (!status.compliance.canMutateEnforcement && 
      !status.compliance.canBlockActions && 
      !status.compliance.canOverrideHumans && 
      !status.compliance.canModifyEvidence) {
    console.log('  ✅ PASS: AI cannot violate enforcement rules\n');
  } else {
    console.log('  ❌ FAIL: AI has enforcement capabilities\n');
  }

  // Test 5: Check AI Models Exist
  console.log('Test 5: AI Models Exist');
  try {
    const insightCount = await prisma.aIInsight.count();
    const suggestionCount = await prisma.aISuggestion.count();
    console.log('  AIInsight count:', insightCount);
    console.log('  AISuggestion count:', suggestionCount);
    console.log('  ✅ PASS: AI models accessible\n');
  } catch (error) {
    console.log('  ❌ FAIL: AI models not found:', error.message, '\n');
  }

  // Test 6: JHA Assist (if JHA exists)
  console.log('Test 6: JHA Assist (Advisory)');
  try {
    const jha = await prisma.jobHazardAnalysis.findFirst();
    if (jha) {
      const result = await suggestJHAHazards(jha.id);
      if (result && result.advisoryOnly && result.aiGenerated) {
        console.log('  ✅ PASS: JHA suggestions are advisory-only\n');
      } else if (result === null && !isAIEnabled()) {
        console.log('  ✅ PASS: AI disabled, system continues\n');
      } else {
        console.log('  ❌ FAIL: Missing governance metadata\n');
      }
    } else {
      console.log('  ⏭️  SKIP: No JHA records found\n');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message, '\n');
  }

  // Test 7: Incident Escalation (if incident exists)
  console.log('Test 7: Incident Escalation (Predictive)');
  try {
    const incident = await prisma.incident.findFirst();
    if (incident) {
      const result = await predictRegulatoryEscalation(incident.id);
      if (result && result.advisoryOnly && result.aiGenerated) {
        console.log('  ✅ PASS: Escalation prediction is advisory-only\n');
      } else if (result === null && !isAIEnabled()) {
        console.log('  ✅ PASS: AI disabled, system continues\n');
      } else {
        console.log('  ❌ FAIL: Missing governance metadata\n');
      }
    } else {
      console.log('  ⏭️  SKIP: No incident records found\n');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message, '\n');
  }

  // Test 8: Cost Forecast (if incident exists)
  console.log('Test 8: Cost Forecast (Forecast Only)');
  try {
    const incident = await prisma.incident.findFirst();
    if (incident) {
      const result = await forecastIncidentCost(incident.id);
      if (result && result.advisoryOnly && result.aiGenerated) {
        console.log('  ✅ PASS: Cost forecast is advisory-only\n');
      } else if (result === null && !isAIEnabled()) {
        console.log('  ✅ PASS: AI disabled, system continues\n');
      } else {
        console.log('  ❌ FAIL: Missing governance metadata\n');
      }
    } else {
      console.log('  ⏭️  SKIP: No incident records found\n');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message, '\n');
  }

  await prisma.$disconnect();
  console.log('✅ AI Layer Testing Complete\n');
}

testAILayer().catch(console.error);

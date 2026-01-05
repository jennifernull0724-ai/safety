import { runCertificationExpirationJob } from './certificationExpirationJob.js';
import { runJHAEnforcementSweep } from './jhaEnforcementSweep.js';
import { runQRVerificationConsistency } from './qrVerificationConsistency.js';
import { runFatigueRiskJob } from './fatigueRiskJob.js';
import { runAINearMissClustering } from './aiNearMissClustering.js';
import { runAuditReadinessScoring } from './auditReadinessScoring.js';
import { runArchivalRetention } from './archivalRetention.js';
import { runSLAUptimeMonitoring } from './slaUptimeMonitoring.js';
import { runGracePeriodTermination } from './gracePeriodTermination.js';
import { runPricingTierValidation } from './pricingTierValidation.js';

export const JOBS = {
  certificationExpiration: runCertificationExpirationJob,
  jhaEnforcementSweep: runJHAEnforcementSweep,
  qrVerificationConsistency: runQRVerificationConsistency,
  fatigueRisk: runFatigueRiskJob,
  aiNearMissClustering: runAINearMissClustering,
  auditReadinessScoring: runAuditReadinessScoring,
  archivalRetention: runArchivalRetention,
  slaUptimeMonitoring: runSLAUptimeMonitoring,
  gracePeriodTermination: runGracePeriodTermination,
  pricingTierValidation: runPricingTierValidation,
};

export async function runAllJobs() {
  console.log('🔄 Running all background jobs...');
  
  const results = {
    certificationExpiration: await runCertificationExpirationJob(),
    jhaEnforcementSweep: await runJHAEnforcementSweep(),
    qrVerificationConsistency: await runQRVerificationConsistency(),
    fatigueRisk: await runFatigueRiskJob(),
    aiNearMissClustering: await runAINearMissClustering(),
    auditReadinessScoring: await runAuditReadinessScoring(),
    archivalRetention: await runArchivalRetention(),
    slaUptimeMonitoring: await runSLAUptimeMonitoring(),
    gracePeriodTermination: await runGracePeriodTermination(),
    pricingTierValidation: await runPricingTierValidation(),
  };

  console.log('✅ All jobs complete:', results);
  return results;
}

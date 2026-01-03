import { runCertificationExpirationJob } from './certificationExpirationJob.js';
import { runJHAEnforcementSweep } from './jhaEnforcementSweep.js';
import { runQRVerificationConsistency } from './qrVerificationConsistency.js';
import { runFatigueRiskJob } from './fatigueRiskJob.js';
import { runAINearMissClustering } from './aiNearMissClustering.js';
import { runAuditReadinessScoring } from './auditReadinessScoring.js';
import { runArchivalRetention } from './archivalRetention.js';

export const JOBS = {
  certificationExpiration: runCertificationExpirationJob,
  jhaEnforcementSweep: runJHAEnforcementSweep,
  qrVerificationConsistency: runQRVerificationConsistency,
  fatigueRisk: runFatigueRiskJob,
  aiNearMissClustering: runAINearMissClustering,
  auditReadinessScoring: runAuditReadinessScoring,
  archivalRetention: runArchivalRetention,
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
  };

  console.log('✅ All jobs complete:', results);
  return results;
}

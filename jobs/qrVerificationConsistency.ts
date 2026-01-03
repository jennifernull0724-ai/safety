/**
 * QR Verification Consistency Job
 * 
 * This job runs periodically to ensure QR verification tokens are consistent:
 * - Removes expired tokens from the database
 * - Validates that tokens reference valid certifications
 * - Logs any inconsistencies as evidence
 * 
 * CRON: 0 * * * * (hourly)
 */

import { prisma } from '../lib/prisma';
import { appendLedgerEntry, writeEvidenceNode } from '../lib/evidence';

export async function runQRVerificationConsistencyJob() {
  console.log('[QR Verification Consistency Job] Starting...');
  const startTime = Date.now();
  
  const results = {
    expiredTokensRemoved: 0,
    orphanedTokensFound: 0,
    inconsistenciesLogged: 0,
  };

  try {
    // 1. Find and remove expired tokens
    const now = new Date();
    const expiredTokens = await prisma.verificationToken.findMany({
      where: { expiresAt: { lt: now } },
    });

    for (const token of expiredTokens) {
      // Log removal as evidence before deleting
      const evidence = await writeEvidenceNode({
        entityType: 'VerificationToken',
        entityId: token.id,
        actorType: 'system',
        actorId: 'qr_consistency_job',
      });

      await appendLedgerEntry({
        evidenceNodeId: evidence.id,
        eventType: 'expired_token_removed',
        payload: { tokenId: token.id, expiredAt: token.expiresAt },
      });

      await prisma.verificationToken.delete({ where: { id: token.id } });
      results.expiredTokensRemoved++;
    }

    // 2. Find tokens referencing invalid certifications
    const allTokens = await prisma.verificationToken.findMany({
      include: { certification: true },
    });

    for (const token of allTokens) {
      if (!token.certification) {
        // Orphaned token - certification was deleted
        const evidence = await writeEvidenceNode({
          entityType: 'VerificationToken',
          entityId: token.id,
          actorType: 'system',
          actorId: 'qr_consistency_job',
        });

        await appendLedgerEntry({
          evidenceNodeId: evidence.id,
          eventType: 'orphaned_token_found',
          payload: { tokenId: token.id, certificationId: token.certificationId },
        });

        await prisma.verificationToken.delete({ where: { id: token.id } });
        results.orphanedTokensFound++;
      }
    }

    // 3. Check for tokens with revoked/expired certifications
    const tokensWithInvalidCerts = await prisma.verificationToken.findMany({
      where: {
        certification: {
          OR: [
            { status: 'EXPIRED' },
            { status: 'REVOKED' },
          ],
        },
      },
      include: { certification: true },
    });

    for (const token of tokensWithInvalidCerts) {
      const evidence = await writeEvidenceNode({
        entityType: 'VerificationToken',
        entityId: token.id,
        actorType: 'system',
        actorId: 'qr_consistency_job',
      });

      await appendLedgerEntry({
        evidenceNodeId: evidence.id,
        eventType: 'token_certification_invalid',
        payload: { 
          tokenId: token.id, 
          certificationId: token.certificationId,
          certificationStatus: token.certification?.status,
        },
      });
      results.inconsistenciesLogged++;
    }

    // Log job completion
    const jobEvidence = await writeEvidenceNode({
      entityType: 'CronJob',
      entityId: 'qr_verification_consistency',
      actorType: 'system',
      actorId: 'qr_consistency_job',
    });

    await appendLedgerEntry({
      evidenceNodeId: jobEvidence.id,
      eventType: 'job_completed',
      payload: {
        duration: Date.now() - startTime,
        results,
      },
    });

    console.log('[QR Verification Consistency Job] Completed:', results);
    return results;

  } catch (error) {
    console.error('[QR Verification Consistency Job] Error:', error);
    
    // Log error as evidence
    const errorEvidence = await writeEvidenceNode({
      entityType: 'CronJob',
      entityId: 'qr_verification_consistency',
      actorType: 'system',
      actorId: 'qr_consistency_job',
    });

    await appendLedgerEntry({
      evidenceNodeId: errorEvidence.id,
      eventType: 'job_failed',
      payload: { error: error instanceof Error ? error.message : 'Unknown error' },
    });

    throw error;
  }
}

// Self-execute if run directly
if (require.main === module) {
  runQRVerificationConsistencyJob()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

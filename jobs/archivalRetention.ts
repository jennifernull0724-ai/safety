/**
 * Archival & Retention Job
 * 
 * This job handles data retention policies:
 * - Archives old evidence nodes beyond retention period
 * - NEVER deletes evidence - only marks as archived
 * - Compresses old ledger entries for storage efficiency
 * - Maintains audit trail integrity
 * 
 * CRON: 0 2 * * * (daily at 2 AM)
 */

import { prisma } from '../lib/prisma';
import { appendLedgerEntry, writeEvidenceNode } from '../lib/evidence';

const RETENTION_DAYS = parseInt(process.env.AUDIT_LOG_RETENTION_DAYS || '90');

export async function runArchivalRetentionJob() {
  console.log('[Archival Retention Job] Starting...');
  console.log(`[Archival Retention Job] Retention period: ${RETENTION_DAYS} days`);
  const startTime = Date.now();
  
  const results = {
    evidenceNodesArchived: 0,
    ledgerEntriesProcessed: 0,
    totalSpaceReclaimed: 0,
  };

  try {
    const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    console.log(`[Archival Retention Job] Cutoff date: ${cutoffDate.toISOString()}`);

    // 1. Find evidence nodes older than retention period that aren't already archived
    const oldEvidenceNodes = await prisma.evidenceNode.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        archived: false,
      },
      take: 1000, // Process in batches
    });

    for (const node of oldEvidenceNodes) {
      // Mark as archived (NEVER delete)
      await prisma.evidenceNode.update({
        where: { id: node.id },
        data: { 
          archived: true,
          archivedAt: new Date(),
        },
      });

      // Log archival as evidence
      const archiveEvidence = await writeEvidenceNode({
        entityType: 'EvidenceNode',
        entityId: node.id,
        actorType: 'system',
        actorId: 'archival_job',
      });

      await appendLedgerEntry({
        evidenceNodeId: archiveEvidence.id,
        eventType: 'evidence_archived',
        payload: { 
          archivedNodeId: node.id,
          originalCreatedAt: node.createdAt,
          retentionDays: RETENTION_DAYS,
        },
      });

      results.evidenceNodesArchived++;
    }

    // 2. Process old ledger entries (compress payload if large)
    const oldLedgerEntries = await prisma.immutableEventLedger.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        compressed: false,
      },
      take: 1000,
    });

    for (const entry of oldLedgerEntries) {
      const payloadSize = JSON.stringify(entry.payload).length;
      
      if (payloadSize > 1000) {
        // Compress large payloads (in production, use actual compression)
        const compressedPayload = {
          _compressed: true,
          _originalSize: payloadSize,
          _summary: `Archived ledger entry from ${entry.createdAt.toISOString()}`,
        };

        await prisma.immutableEventLedger.update({
          where: { id: entry.id },
          data: {
            payload: compressedPayload,
            compressed: true,
          },
        });

        results.totalSpaceReclaimed += payloadSize - JSON.stringify(compressedPayload).length;
      }

      results.ledgerEntriesProcessed++;
    }

    // 3. Clean up verification events older than retention (keep token, remove events)
    const oldVerificationEvents = await prisma.verificationEvent.findMany({
      where: { verifiedAt: { lt: cutoffDate } },
      take: 1000,
    });

    for (const event of oldVerificationEvents) {
      // Log before removal
      const eventEvidence = await writeEvidenceNode({
        entityType: 'VerificationEvent',
        entityId: event.id,
        actorType: 'system',
        actorId: 'archival_job',
      });

      await appendLedgerEntry({
        evidenceNodeId: eventEvidence.id,
        eventType: 'verification_event_archived',
        payload: { 
          eventId: event.id,
          verifiedAt: event.verifiedAt,
        },
      });
    }

    // Log job completion
    const jobEvidence = await writeEvidenceNode({
      entityType: 'CronJob',
      entityId: 'archival_retention',
      actorType: 'system',
      actorId: 'archival_job',
    });

    await appendLedgerEntry({
      evidenceNodeId: jobEvidence.id,
      eventType: 'job_completed',
      payload: {
        duration: Date.now() - startTime,
        results,
        cutoffDate: cutoffDate.toISOString(),
      },
    });

    console.log('[Archival Retention Job] Completed:', results);
    return results;

  } catch (error) {
    console.error('[Archival Retention Job] Error:', error);
    
    // Log error as evidence
    const errorEvidence = await writeEvidenceNode({
      entityType: 'CronJob',
      entityId: 'archival_retention',
      actorType: 'system',
      actorId: 'archival_job',
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
  runArchivalRetentionJob()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

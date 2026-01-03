// lib/withEvidence.ts
import { prisma } from '@/lib/prisma';

/**
 * AUTHORITATIVE EVIDENCE WRAPPER
 * 
 * Wraps regulated mutations with mandatory evidence + ledger append.
 * Transactional, fail-closed, atomic.
 * 
 * If ledger write fails → entire transaction rolls back.
 */
export async function withEvidence<T>({
  entityType,
  entityId,
  actorType,
  actorId,
  eventType,
  payload,
  action,
}: {
  entityType: string;
  entityId: string;
  actorType: 'user' | 'employee' | 'system' | 'regulator';
  actorId: string;
  eventType: string;
  payload: Record<string, any>;
  action: (tx: typeof prisma) => Promise<T>;
}): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // 1. Execute regulated action
    const result = await action(tx);

    // 2. Write evidence node
    const evidenceNode = await tx.evidenceNode.create({
      data: {
        entityType,
        entityId,
        actorType,
        actorId,
        locationId: null,
      },
    });

    // 3. Append immutable ledger entry
    await tx.immutableEventLedger.create({
      data: {
        evidenceNodeId: evidenceNode.id,
        eventType,
        payload,
      },
    });

    return result;
  });
}

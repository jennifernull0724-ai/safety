// lib/withEvidence.ts
import { writeEvidenceNode, appendLedgerEntry } from './evidence';

/**
 * Wraps a regulated mutation with mandatory evidence and ledger append.
 * Throws if ledger append fails. Ensures atomicity.
 */
export async function withEvidence({
  entityType,
  entityId,
  actorType,
  actorId,
  locationId,
  eventType,
  payload,
  action,
}: {
  entityType: string;
  entityId: string;
  actorType: 'user' | 'employee' | 'system';
  actorId: string;
  locationId?: string | null;
  eventType: string;
  payload: any;
  action: () => Promise<any>;
}) {
  // 1. Write evidence node
  const evidence = await writeEvidenceNode({ entityType, entityId, actorType, actorId, locationId });
  // 2. Perform regulated action
  const result = await action();
  // 3. Append ledger entry
  await appendLedgerEntry({ evidenceNodeId: evidence.id, eventType, payload });
  return result;
}

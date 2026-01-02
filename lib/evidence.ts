// lib/evidence.ts
import prisma from './prisma';

export async function writeEvidenceNode({
  entityType,
  entityId,
  actorType,
  actorId,
  locationId = null,
}: {
  entityType: string;
  entityId: string;
  actorType: 'user' | 'employee' | 'system';
  actorId: string;
  locationId?: string | null;
}) {
  return prisma.evidenceNode.create({
    data: {
      entityType,
      entityId,
      actorType,
      actorId,
      locationId,
    },
  });
}

export async function appendLedgerEntry({
  evidenceNodeId,
  eventType,
  payload,
}: {
  evidenceNodeId: string;
  eventType: string;
  payload: any;
}) {
  return prisma.immutableEventLedger.create({
    data: {
      evidenceNodeId,
      eventType,
      payload,
    },
  });
}

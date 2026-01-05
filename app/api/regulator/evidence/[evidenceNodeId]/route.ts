import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendLedgerEntry, writeEvidenceNode } from '@/lib/evidence';

// GET /api/regulator/evidence/:evidenceNodeId - Regulator access to evidence (all access logged)
export async function GET(req: NextRequest, { params }: { params: { evidenceNodeId: string } }) {
  const evidenceNode = await prisma.evidenceNode.findUnique({
    where: { id: params.evidenceNodeId },
    include: { ledgerEntries: true },
  });
  if (!evidenceNode) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Log regulator access as evidence
  const accessEvidence = await writeEvidenceNode({
    entityType: 'EvidenceNode',
    entityId: params.evidenceNodeId,
    actorType: 'regulator',
    actorId: 'regulator_access',
  });
  await appendLedgerEntry({
    evidenceNodeId: accessEvidence.id,
    eventType: 'regulator_evidence_accessed',
    payload: { accessedEvidenceNodeId: params.evidenceNodeId, accessedAt: new Date().toISOString() },
  });

  return NextResponse.json(evidenceNode);
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendLedgerEntry, writeEvidenceNode } from '@/lib/evidence';

// GET /api/audits/:auditId/export - Export audit package
export async function GET(req: NextRequest, { params }: { params: { auditId: string } }) {
  const audit = await prisma.auditCase.findUnique({
    where: { id: params.auditId },
    include: {
      evidenceLinks: { include: { EvidenceNode: { include: { ImmutableEventLedger: true } } } },
      organization: true,
    },
  });
  if (!audit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Log the export as evidence
  const evidence = await writeEvidenceNode({
    entityType: 'AuditCase',
    entityId: params.auditId,
    actorType: 'user',
    actorId: 'export_request',
  });
  await appendLedgerEntry({
    evidenceNodeId: evidence.id,
    eventType: 'audit_exported',
    payload: { auditId: params.auditId, exportedAt: new Date().toISOString() },
  });

  return NextResponse.json({
    auditCase: audit,
    exportedAt: new Date().toISOString(),
    evidenceCount: audit.evidenceLinks.length,
  });
}

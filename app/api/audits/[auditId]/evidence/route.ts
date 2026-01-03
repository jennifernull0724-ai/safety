import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/audits/:auditId/evidence - Attach evidence to audit
export async function POST(req: NextRequest, { params }: { params: { auditId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'AuditEvidenceLink',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.attachedBy || 'system',
    eventType: 'evidence_attached_to_audit',
    payload: { auditCaseId: params.auditId, evidenceNodeId: data.evidenceNodeId },
    action: async () => {
      return prisma.auditEvidenceLink.create({
        data: { auditCaseId: params.auditId, evidenceNodeId: data.evidenceNodeId },
      });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

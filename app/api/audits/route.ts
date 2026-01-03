import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/audits - List all audit cases
export async function GET(req: NextRequest) {
  const audits = await prisma.auditCase.findMany({
    include: { evidenceLinks: true, organization: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(audits);
}

// POST /api/audits - Create audit case
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'AuditCase',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'audit_case_created',
    payload: data,
    action: async () => {
      return prisma.auditCase.create({ data });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

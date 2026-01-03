import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/audits/:auditId
export async function GET(req: NextRequest, { params }: { params: { auditId: string } }) {
  const audit = await prisma.auditCase.findUnique({
    where: { id: params.auditId },
    include: { evidenceLinks: { include: { evidenceNode: true } }, organization: true },
  });
  if (!audit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(audit);
}

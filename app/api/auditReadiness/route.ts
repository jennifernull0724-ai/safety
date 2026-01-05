import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auditReadiness - Get audit readiness scores
export async function GET(req: NextRequest) {
  // Get audit cases and evidence counts for readiness calculation
  const auditCases = await prisma.auditCase.findMany({
    include: { evidenceLinks: true },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate readiness score for each audit case
  const scores = auditCases.map(audit => {
    const evidenceCount = audit.evidenceLinks.length;
    const score = evidenceCount > 10 ? 100 : evidenceCount * 10;
    return {
      auditCaseId: audit.id,
      auditType: audit.auditType,
      status: audit.status,
      evidenceCount,
      readinessScore: score,
      createdAt: audit.createdAt,
    };
  });

  return NextResponse.json({ scores });
}

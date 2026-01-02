import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/auditReadiness - Get audit readiness scores (regulated, org/role enforced)
export async function GET(req: NextRequest) {
  // Enforce org/role middleware (pseudo, replace with actual logic)
  // await enforceOrgScope(req);
  // await enforceRole(req, ['admin', 'safety', 'executive', 'regulator']);

  const scores = await prisma.auditReadinessScore.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ scores });
}

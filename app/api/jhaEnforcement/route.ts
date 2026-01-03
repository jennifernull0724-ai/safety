import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/jhaEnforcement - Get JHA enforcement flags (regulated, org/role enforced)
export async function GET(req: NextRequest) {
  // Enforce org/role middleware (pseudo, replace with actual logic)
  // await enforceOrgScope(req);
  // await enforceRole(req, ['admin', 'safety', 'executive', 'regulator']);

  // Query enforcement actions filtered to JHA blocks
  const flags = await prisma.enforcementAction.findMany({
    where: { actionType: 'jha_block' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ flags });
}

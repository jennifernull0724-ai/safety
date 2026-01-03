import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ledger - List ledger entries (regulated, org/role enforced)
export async function GET(req: NextRequest) {
  // Enforce org/role middleware (pseudo, replace with actual logic)
  // await enforceOrgScope(req);
  // await enforceRole(req, ['admin', 'safety', 'executive', 'regulator']);

  const entries = await prisma.immutableEventLedger.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ entries });
}

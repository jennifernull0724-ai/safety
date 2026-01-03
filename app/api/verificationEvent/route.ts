import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/verificationEvent - List verification events (regulated, org/role enforced)
export async function GET(req: NextRequest) {
  // Enforce org/role middleware (pseudo, replace with actual logic)
  // await enforceOrgScope(req);
  // await enforceRole(req, ['admin', 'safety', 'executive', 'regulator']);

  const events = await prisma.verificationEvent.findMany({
    orderBy: { verifiedAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ events });
}

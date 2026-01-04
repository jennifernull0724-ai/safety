import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/certificationExpiration - Get expired certifications (regulated, org/role enforced)
export async function GET(req: NextRequest) {
  // Enforce org/role middleware (pseudo, replace with actual logic)
  // await enforceOrgScope(req);
  // await enforceRole(req, ['admin', 'safety', 'executive', 'regulator']);

  const expired = await prisma.certification.findMany({
    where: { status: 'expired' },
    orderBy: { expirationDate: 'desc' },
    take: 100,
  });
  return NextResponse.json({ expired });
}

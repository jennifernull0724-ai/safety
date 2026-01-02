import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/public/certification/:id - Public QR verification (public-only, no org/role enforcement)
export async function GET(req: NextRequest) {
  // Only allow public access, no org/role enforcement
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const certification = await prisma.certification.findUnique({
    where: { id },
  });
  if (!certification) return NextResponse.json({ status: 'not_found' }, { status: 404 });

  return NextResponse.json({
    certificationId: certification.id,
    status: certification.status,
    expires: certification.expirationDate,
  });
}

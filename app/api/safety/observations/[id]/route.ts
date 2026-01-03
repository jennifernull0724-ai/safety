import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/safety/observations/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const observation = await prisma.nearMiss.findUnique({
    where: { id: params.id },
  });
  if (!observation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(observation);
}

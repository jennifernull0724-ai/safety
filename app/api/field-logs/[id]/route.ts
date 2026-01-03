import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/field-logs/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const log = await prisma.fieldLog.findUnique({
    where: { id: params.id },
    include: { Employee: true },
  });
  if (!log) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(log);
}

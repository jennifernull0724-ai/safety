import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// GET /api/employees/:employeeId/certifications
export async function GET(req: NextRequest, { params }: { params: { employeeId: string } }) {
  const certifications = await prisma.certification.findMany({
    where: { employeeId: params.employeeId },
    orderBy: { expirationDate: 'asc' },
  });
  return NextResponse.json(certifications);
}

// POST /api/employees/:employeeId/certifications
export async function POST(req: NextRequest, { params }: { params: { employeeId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Certification',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.createdBy || 'system',
    eventType: 'certification_created',
    payload: { ...data, employeeId: params.employeeId },
    action: async () => {
      return prisma.certification.create({
        data: { ...data, employeeId: params.employeeId },
      });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

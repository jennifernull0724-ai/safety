import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';
import { enforceCertification } from '@/lib/enforcement';

// POST /api/jha/:jhaId/acknowledge - Crew acknowledgment (enforces certification)
export async function POST(req: NextRequest, { params }: { params: { jhaId: string } }) {
  const data = await req.json();
  
  // Enforce certification validity before acknowledgment (check all required cert types)
  const requiredCertTypes = data.requiredCertTypes || [];
  for (const certType of requiredCertTypes) {
    await enforceCertification({ employeeId: data.employeeId, certificationType: certType });
  }

  const result = await withEvidence({
    entityType: 'JHAAcknowledgment',
    entityId: 'pending',
    actorType: 'employee',
    actorId: data.employeeId,
    eventType: 'jha_acknowledged',
    payload: { jhaId: params.jhaId, employeeId: data.employeeId },
    action: async () => {
      return prisma.jHAAcknowledgment.create({
        data: { jhaId: params.jhaId, employeeId: data.employeeId, acknowledgedAt: new Date() },
      });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

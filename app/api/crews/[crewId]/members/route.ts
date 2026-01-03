import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/crews/:crewId/members - Add member to crew
export async function POST(req: NextRequest, { params }: { params: { crewId: string } }) {
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'CrewMember',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.addedBy || 'system',
    eventType: 'crew_member_added',
    payload: { crewId: params.crewId, employeeId: data.employeeId },
    action: async () => {
      return prisma.crewMember.create({
        data: { crewId: params.crewId, employeeId: data.employeeId },
      });
    },
  });
  return NextResponse.json(result, { status: 201 });
}

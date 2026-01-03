import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';

// DELETE /api/crews/:crewId/members/:employeeId - Remove member from crew
export async function DELETE(req: NextRequest, { params }: { params: { crewId: string; employeeId: string } }) {
  const result = await withEvidence({
    entityType: 'CrewMember',
    entityId: `${params.crewId}-${params.employeeId}`,
    actorType: 'user',
    actorId: 'system',
    eventType: 'crew_member_removed',
    payload: { crewId: params.crewId, employeeId: params.employeeId },
    action: async () => {
      return prisma.crewMember.deleteMany({
        where: { crewId: params.crewId, employeeId: params.employeeId },
      });
    },
  });
  return NextResponse.json({ success: true });
}

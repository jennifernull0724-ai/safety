// app/api/work-windows/[id]/assign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/middleware/getUserFromRequest';
import { enforceCertificationRequirements } from '@/lib/enforcement/certificationGuard';
import { withEvidence } from '@/lib/withEvidence';
import { prisma } from '@/lib/prisma';

/**
 * WORK WINDOW ASSIGNMENT ENDPOINT
 * 
 * Enforcement:
 * - Requires valid certifications for assigned employee
 * - Writes evidence + ledger
 * - Blocks if employee has any blocked certs
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireUser(request);
    const { employeeId, startTime, endTime } = await request.json();

    // ENFORCEMENT: Check certifications BEFORE assignment
    const requiredCerts = ['Railroad Safety & Access']; // TODO: Get from work type
    await enforceCertificationRequirements(
      employeeId,
      requiredCerts,
      user.id
    );

    // Create work window with evidence
    const result = await withEvidence(
      async () => {
        return prisma.workWindow.create({
          data: {
            employeeId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status: 'scheduled',
          },
        });
      },
      {
        entityType: 'WorkWindow',
        entityId: params.id,
        actorType: 'user',
        actorId: user.id,
        eventType: 'work_window_assigned',
        eventPayload: { employeeId, startTime, endTime },
      }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.status === 403) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

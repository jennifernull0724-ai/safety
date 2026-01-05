import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/regulator/point-in-time/[employeeId]
 * 
 * Returns employee compliance status at a specific point in time
 * READ-ONLY - Public regulator access
 * Queries historical state from ImmutableEventLedger
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params;
    const searchParams = req.nextUrl.searchParams;
    const targetDate = searchParams.get('date');

    if (!targetDate) {
      return NextResponse.json(
        { error: 'Date parameter required' },
        { status: 400 }
      );
    }

    const queryDate = new Date(targetDate);

    // Find employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Get all certifications that existed at target date
    const certifications = await prisma.certification.findMany({
      where: {
        employeeId,
        createdAt: { lte: queryDate }
      }
    });

    // For each certification, determine its status at the target date
    const certStatusPromises = certifications.map(async (cert) => {
      // Get latest ledger entry before target date
      const latestEvent = await prisma.immutableEventLedger.findFirst({
        where: {
          evidenceNode: {
            entityType: 'Certification',
            entityId: cert.id
          },
          createdAt: { lte: queryDate }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Determine status at that point in time
      let status = 'Unknown';
      let compliant = false;

      if (cert.expirationDate) {
        if (queryDate <= cert.expirationDate) {
          status = `Valid - Expires ${cert.expirationDate.toISOString().split('T')[0]}`;
          compliant = true;
        } else {
          status = 'EXPIRED';
          compliant = false;
        }
      } else if (cert.isNonExpiring) {
        status = 'Valid - Non-expiring';
        compliant = true;
      }

      return {
        certificationType: cert.certificationType,
        status,
        compliant,
        issuingAuthority: cert.issuingAuthority,
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate
      };
    });

    const certStatuses = await Promise.all(certStatusPromises);

    // Overall compliance: all certifications must be compliant
    const overallCompliant = certStatuses.every(c => c.compliant);

    // Log regulator access
    await prisma.evidenceNode.create({
      data: {
        entityType: 'RegulatorAccess',
        entityId: employeeId,
        actorType: 'regulator',
        actorId: 'point_in_time_query',
      }
    });

    return NextResponse.json({
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName
      },
      queryDate: queryDate.toISOString(),
      compliant: overallCompliant,
      certifications: certStatuses
    });

  } catch (error) {
    console.error('Failed to query point-in-time status:', error);
    return NextResponse.json(
      { error: 'Failed to query point-in-time status' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deriveCertificationStatus } from '@/lib/compliancePresets';

export async function GET(
  req: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params;

    // Fetch employee with all certifications and QR token
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        Organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        Certification: {
          include: {
            mediaFiles: {
              select: {
                id: true,
                objectPath: true,
                mimeType: true,
                uploadedAt: true,
                checksumSha256: true,
              },
            },
          },
          orderBy: {
            presetCategory: 'asc',
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Get QR token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });

    // Derive certification statuses
    const certificationsWithStatus = employee.Certification.map((cert) => {
      const status = deriveCertificationStatus(cert);
      return {
        ...cert,
        status,
      };
    });

    return NextResponse.json({
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: `${employee.firstName} ${employee.lastName}`,
        tradeRole: employee.tradeRole,
        status: employee.status,
        photoMediaId: employee.photoMediaId,
        Organization: employee.Organization,
      },
      certifications: certificationsWithStatus,
      qrToken: verificationToken?.rawToken || null,
    });
  } catch (error: any) {
    console.error('Employee fetch failed:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

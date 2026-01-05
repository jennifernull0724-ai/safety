// app/api/verify/employee/[qrToken]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyEmployeeQrToken } from '@/lib/qrToken';
import { deriveCertificationStatus, getFailureReason } from '@/lib/compliancePresets';

/**
 * GET /api/verify/employee/[qrToken]
 * 
 * PUBLIC ENDPOINT - NO AUTHENTICATION REQUIRED
 * STRICTLY READ-ONLY
 * 
 * Used by:
 * - Railroads
 * - Inspectors
 * - Emergency responders
 * - Regulators
 * 
 * Returns:
 * - Employee identity
 * - All certifications with derived status
 * - No mutation capabilities
 * 
 * Optional: Log VerificationEvent (scan log only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { qrToken: string } }
) {
  try {
    const { qrToken } = params;

    if (!qrToken) {
      return NextResponse.json(
        { error: 'QR token is required' },
        { status: 400 }
      );
    }

    // Verify the token exists and is active
    const verificationToken = await verifyEmployeeQrToken(qrToken);

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or inactive QR token' },
        { status: 404 }
      );
    }

    // READ-ONLY: Fetch employee with all certifications and media
    const employee = await prisma.employee.findUnique({
      where: { id: verificationToken.employeeId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        certification: {
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
            expirationDate: 'asc', // Soonest expiration first
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

    // Derive certification statuses
    const certificationsWithStatus = employee.Certification.map((cert) => {
      const status = deriveCertificationStatus(cert);
      const failureReason = status === 'FAIL' || status === 'INCOMPLETE' 
        ? getFailureReason(cert) 
        : null;

      return {
        id: cert.id,
        presetCategory: cert.presetCategory,
        certificationType: cert.certificationType,
        issuingAuthority: cert.issuingAuthority,
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate,
        isNonExpiring: cert.isNonExpiring,
        status,
        failureReason,
        lastVerifiedAt: cert.lastVerifiedAt,
        mediaFiles: cert.mediaFiles,
      };
    });

    // Optional: Log verification event (scan)
    const scannedByType = req.headers.get('x-scanner-type') || null;
    const scannedById = req.headers.get('x-scanner-id') || null;

    await prisma.verificationEvent.create({
      data: {
        verificationTokenId: verificationToken.id,
        scannedByType,
        scannedById,
      },
    });

    // Return read-only employee data
    return NextResponse.json({
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: `${employee.firstName} ${employee.lastName}`,
        tradeRole: employee.tradeRole,
        status: employee.status,
        photoMediaId: employee.photoMediaId,
        organization: {
          name: employee.Organization.name,
          type: employee.Organization.type,
        },
      },
      certifications: certificationsWithStatus,
      verificationToken: {
        createdAt: verificationToken.createdAt,
        lastScanned: verificationToken.scans?.[0]?.scannedAt || null,
      },
    });
  } catch (error: any) {
    console.error('QR verification failed:', error);
    return NextResponse.json(
      { error: 'Verification failed', details: error.message },
      { status: 500 }
    );
  }
}

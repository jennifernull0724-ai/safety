// app/api/internal/employees/[employeeId]/certifications/[certificationId]/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';
import crypto from 'crypto';

/**
 * POST /api/internal/employees/[employeeId]/certifications/[certificationId]/upload
 * 
 * INTERNAL ONLY - Authenticated certification proof upload
 * 
 * FLOW:
 * 1. Validate certification belongs to employee
 * 2. Create MediaObject with GCS metadata
 * 3. Link media to certification
 * 4. Update certification dates if provided
 * 5. Derive and update status
 * 6. Create evidence + ledger entry
 * 
 * RULES:
 * - Certifications are immutable (no edits/deletes)
 * - Replacement = new upload + new evidence
 * - All operations use withEvidence()
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { employeeId: string; certificationId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    const organizationId = req.headers.get('x-organization-id');

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { employeeId, certificationId } = params;
    const body = await req.json();
    const {
      bucket,
      objectPath,
      mimeType,
      sizeBytes,
      checksumSha256,
      issueDate,
      expirationDate,
      issuingAuthority,
    } = body;

    // Validate required fields
    if (!bucket || !objectPath || !mimeType || !sizeBytes || !checksumSha256) {
      return NextResponse.json(
        { error: 'Missing required upload metadata' },
        { status: 400 }
      );
    }

    // Verify certification belongs to employee
    const certification = await prisma.certification.findUnique({
      where: { id: certificationId },
      include: {
        employee: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!certification || certification.employeeId !== employeeId) {
      return NextResponse.json(
        { error: 'Certification not found or does not belong to employee' },
        { status: 404 }
      );
    }

    // Verify organization scope
    if (certification.employee.organizationId !== organizationId) {
      return NextResponse.json(
        { error: 'Forbidden - organization mismatch' },
        { status: 403 }
      );
    }

    // Use withEvidence to wrap the upload operation
    const result = await withEvidence({
      entityType: 'certification',
      entityId: certificationId,
      actorType: 'user',
      actorId: userId,
      eventType: 'CERTIFICATION_PROOF_UPLOADED',
      payload: {
        employeeId,
        certificationType: certification.certificationType,
        objectPath,
        checksumSha256,
        issueDate,
        expirationDate,
      },
      action: async (tx) => {
        // Create MediaObject
        const mediaObject = await tx.mediaObject.create({
          data: {
            bucket,
            objectPath,
            mimeType,
            sizeBytes,
            checksumSha256,
            certificationId,
            employeeId,
            evidenceNodeId: 'pending', // Will be set by evidence creation
          },
        });

        // Update certification with dates and status
        const updateData: any = {
          lastVerifiedAt: new Date(),
        };

        if (issueDate) {
          updateData.issueDate = new Date(issueDate);
        }

        if (expirationDate) {
          updateData.expirationDate = new Date(expirationDate);
        }

        if (issuingAuthority) {
          updateData.issuingAuthority = issuingAuthority;
        }

        // Derive status based on uploaded data
        const hasProof = true;
        const hasIssueDate = issueDate || certification.issueDate;
        const hasExpiration = expirationDate || certification.expirationDate;
        const isNonExpiring = certification.isNonExpiring;

        let status: 'PASS' | 'FAIL' | 'INCOMPLETE' = 'INCOMPLETE';

        if (hasProof && hasIssueDate) {
          if (isNonExpiring) {
            status = 'PASS';
          } else if (hasExpiration) {
            const expDate = new Date(expirationDate || certification.expirationDate!);
            status = expDate > new Date() ? 'PASS' : 'FAIL';
          }
        }

        updateData.status = status;

        const updatedCertification = await tx.certification.update({
          where: { id: certificationId },
          data: updateData,
          include: {
            mediaFiles: true,
          },
        });

        return {
          mediaObject,
          certification: updatedCertification,
        };
      },
    });

    return NextResponse.json({
      success: true,
      mediaObject: result.mediaObject,
      certification: result.certification,
    });
  } catch (error: any) {
    console.error('Certification upload failed:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

// app/api/internal/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withEvidence } from '@/lib/withEvidence';
import { generateEmployeeQrToken } from '@/lib/qrToken';
import { getRequiredCertifications } from '@/lib/compliancePresets';

/**
 * POST /api/internal/employees
 * 
 * INTERNAL ONLY - Authenticated, company-scoped employee creation
 * 
 * ATOMIC OPERATIONS:
 * 1. Create Employee
 * 2. Generate QR token (ONCE, never regenerated)
 * 3. Instantiate all required Certification records (status=INCOMPLETE)
 * 4. Create EvidenceNode
 * 5. Append ImmutableEventLedger
 * 
 * If evidence or ledger append fails → rollback employee creation.
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication middleware
    // For now, extract from headers or session
    const userId = req.headers.get('x-user-id');
    const organizationId = req.headers.get('x-organization-id');

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized - missing user or organization context' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, tradeRole, photoMediaId } = body;

    // Validate required fields
    if (!firstName || !lastName || !tradeRole) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, tradeRole' },
        { status: 400 }
      );
    }

    // Use withEvidence to wrap the entire employee creation
    const result = await withEvidence({
      entityType: 'employee',
      entityId: 'pending',
      actorType: 'user',
      actorId: userId,
      eventType: 'EMPLOYEE_CREATED',
      payload: {
        firstName,
        lastName,
        tradeRole,
        organizationId,
      },
      action: async (tx) => {
        // 1. Create Employee
        const employee = await tx.employee.create({
          data: {
            organizationId,
            firstName,
            lastName,
            tradeRole,
            photoMediaId: photoMediaId || null,
            status: 'active',
          },
        });

        // 2. Generate QR token (ONCE)
        const { rawToken, verificationToken } = await generateEmployeeQrToken({
          employeeId: employee.id,
        });

        // 3. Get all required certification presets
        const presets = getRequiredCertifications();

        // 4. Instantiate all required Certification records
        const certifications = await Promise.all(
          presets.map((preset) =>
            tx.certification.create({
              data: {
                employeeId: employee.id,
                presetCategory: preset.category,
                certificationType: preset.name,
                issuingAuthority: preset.issuingAuthority || null,
                issueDate: null,
                expirationDate: null,
                isNonExpiring: !preset.requiresExpiration,
                status: 'INCOMPLETE',
                createdByUserId: userId,
              },
            })
          )
        );

        return {
          employee,
          qrToken: rawToken,
          verificationTokenId: verificationToken.id,
          certificationsCreated: certifications.length,
        };
      },
    });

    return NextResponse.json(
      {
        success: true,
        employee: result.employee,
        qrToken: result.qrToken,
        message: `Employee created with ${result.certificationsCreated} required certifications`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Employee creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create employee', details: error.message },
      { status: 500 }
    );
  }
}

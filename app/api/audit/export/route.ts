import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateAuditPackage } from '@/lib/services/auditExport';

/**
 * POST /api/audit/export
 * Generate a complete audit package with all compliance data
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      organizationId,
      includeEmployees = true,
      includeCertifications = true,
      includeVerificationLogs = true,
      includeEvidenceFiles = false,
      startDate,
      endDate,
    } = body;

    const options = {
      organizationId,
      includeEmployees,
      includeCertifications,
      includeVerificationLogs,
      includeEvidenceFiles,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const result = await generateAuditPackage(
      options,
      session.user.email || session.user.id || 'unknown'
    );

    // Return the ZIP file
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'X-Audit-Package-Hash': result.manifest.integrityHash,
        'X-Export-Timestamp': result.manifest.exportedAt,
      },
    });
  } catch (error: any) {
    console.error('Audit export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate audit package' },
      { status: 500 }
    );
  }
}

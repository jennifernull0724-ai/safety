import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { correctCertification, getCorrectionChain } from '@/lib/services/certificationCorrection';

/**
 * POST /api/certifications/[id]/correct
 * Create a correction for an existing certification
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reason, changes } = body;

    if (!reason || !changes) {
      return NextResponse.json(
        { error: 'Correction reason and changes are required' },
        { status: 400 }
      );
    }

    const result = await correctCertification({
      originalCertificationId: params.id,
      correctionReason: reason,
      correctedByUserId: session.user.id || session.user.email || 'unknown',
      newData: changes,
    });

    return NextResponse.json({
      success: true,
      original: result.original,
      corrected: result.corrected,
    });
  } catch (error: any) {
    console.error('Certification correction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create correction' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/certifications/[id]/correct
 * Get the correction chain for a certification
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chain = await getCorrectionChain(params.id);
    return NextResponse.json({ chain });
  } catch (error: any) {
    console.error('Get correction chain error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get correction chain' },
      { status: 500 }
    );
  }
}

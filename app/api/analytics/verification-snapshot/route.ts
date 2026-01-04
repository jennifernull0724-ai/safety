import { NextResponse } from 'next/server';

/**
 * VERIFICATION ACTIVITY SNAPSHOT API
 * 
 * Purpose: Show recent system usage (last 24-72h)
 * 
 * Rules:
 * - Window-limited only
 * - No lifetime totals
 * - No charts implied
 * - Time-bounded queries only
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const window = searchParams.get('window') || '24h';
    
    // Validate window param
    if (!['24h', '72h'].includes(window)) {
      return NextResponse.json(
        { error: 'Invalid window parameter. Use 24h or 72h' },
        { status: 400 }
      );
    }

    // TODO: Add auth middleware
    // TODO: Add org-scope middleware
    
    // PLACEHOLDER DATA - Replace with actual Prisma queries
    const response = {
      window,
      total: 87,
      results: {
        verified: 61,
        failed: 11,
        blocked: 9,
        expired: 6
      },
      types: {
        qr_scan: 54,
        cert_check: 29,
        jha_ack: 4
      },
      generated_at: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch verification snapshot' },
      { status: 500 }
    );
  }
}

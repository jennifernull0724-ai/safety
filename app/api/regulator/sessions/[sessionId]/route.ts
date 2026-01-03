import { NextRequest, NextResponse } from 'next/server';

// GET /api/regulator/sessions/:sessionId
export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  // TODO: Validate session and return session info
  return NextResponse.json({
    sessionId: params.sessionId,
    active: true,
  });
}

import { NextRequest, NextResponse } from 'next/server';

// GET /api/media/:mediaId - Get media file
export async function GET(req: NextRequest, { params }: { params: { mediaId: string } }) {
  // TODO: Implement file retrieval from GCS
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

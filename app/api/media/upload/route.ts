import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';

// POST /api/media/upload - Upload media file
export async function POST(req: NextRequest) {
  // TODO: Implement file upload to GCS
  const data = await req.json();
  const result = await withEvidence({
    entityType: 'Media',
    entityId: 'pending',
    actorType: 'user',
    actorId: data.uploadedBy || 'system',
    eventType: 'media_uploaded',
    payload: { filename: data.filename },
    action: async () => {
      return { id: 'pending', filename: data.filename, uploadedAt: new Date() };
    },
  });
  return NextResponse.json(result, { status: 201 });
}

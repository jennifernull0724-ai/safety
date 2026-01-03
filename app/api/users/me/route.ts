import { NextRequest, NextResponse } from 'next/server';

// GET /api/users/me - Get current authenticated user
export async function GET(req: NextRequest) {
  // TODO: Implement auth and return current user
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}

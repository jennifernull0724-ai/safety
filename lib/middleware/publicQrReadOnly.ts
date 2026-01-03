// lib/middleware/publicQrReadOnly.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * PUBLIC QR READ-ONLY MIDDLEWARE
 * 
 * PURPOSE: Guarantee zero mutation from public QR pages
 * APPLIES TO: /verify/employee/*
 * 
 * RULES:
 * - Allow ONLY: GET
 * - Block: POST, PUT, PATCH, DELETE
 * 
 * WHY THIS EXISTS:
 * - Prevents accidental mutation
 * - Prevents malicious requests
 * - Makes read-only a hard backend guarantee, not UI-based
 */
export function publicQrReadOnly(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Public QR endpoints are read-only' },
      { status: 403 }
    );
  }
  return NextResponse.next();
}

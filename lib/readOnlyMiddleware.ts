import { NextRequest, NextResponse } from 'next/server';
import { isReadOnlyMode } from './services/terminationGracePeriod';
import { prisma } from './prisma';

/**
 * READ-ONLY MODE ENFORCEMENT MIDDLEWARE
 * 
 * Blocks all write operations during grace period.
 * Only QR verification and data reads are allowed.
 */

const READ_ONLY_PATHS = [
  '/api/qr-verify',
  '/qr',
];

const WRITE_OPERATIONS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export async function readOnlyMiddleware(request: NextRequest) {
  // Allow read-only paths
  if (READ_ONLY_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Only check write operations
  if (!WRITE_OPERATIONS.includes(request.method)) {
    return NextResponse.next();
  }

  // Extract organization from session/auth
  // This is a placeholder - actual implementation depends on your auth setup
  const organizationId = await getOrganizationFromRequest(request);
  
  if (!organizationId) {
    return NextResponse.next();
  }

  // Check if organization is in read-only mode
  const readOnly = await isReadOnlyMode(organizationId);
  
  if (readOnly) {
    return NextResponse.json(
      {
        error: 'Account is in read-only mode due to subscription cancellation',
        message: 'Your subscription has been canceled. You have read-only access to your data for 30 days. Please reactivate your subscription to make changes.',
      },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

/**
 * Extract organization ID from request
 * TODO: Replace with actual auth implementation
 */
async function getOrganizationFromRequest(request: NextRequest): Promise<string | null> {
  // This is a placeholder - you'll need to implement based on your auth
  // Examples:
  // - Check JWT token
  // - Query session from database
  // - Extract from request headers
  
  return null;
}

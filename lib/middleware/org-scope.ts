import { NextRequest, NextResponse } from 'next/server';
import { AuthUser } from './auth';

// Organization scope middleware - ensures users can only access their org's data
export async function withOrgScope<T extends { organizationId?: string }>(
  req: NextRequest,
  user: AuthUser,
  handler: (req: NextRequest, user: AuthUser, orgId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  // Regulators can access any org
  if (user.role === 'regulator') {
    const orgId = req.nextUrl.searchParams.get('organizationId') || user.organizationId;
    return handler(req, user, orgId);
  }

  // All other users are scoped to their organization
  return handler(req, user, user.organizationId);
}

// Validate that a resource belongs to the user's organization
export function validateOrgAccess(resourceOrgId: string | null | undefined, userOrgId: string): boolean {
  if (!resourceOrgId) return true; // Allow if resource has no org (global resource)
  return resourceOrgId === userOrgId;
}

// Add org filter to Prisma queries
export function orgScopeFilter(user: AuthUser): { organizationId?: string } {
  // Regulators don't get org-scoped - they see everything
  if (user.role === 'regulator') {
    return {};
  }
  return { organizationId: user.organizationId };
}

// Inject organization ID into create/update operations
export function injectOrgId<T extends Record<string, unknown>>(data: T, user: AuthUser): T & { organizationId: string } {
  return {
    ...data,
    organizationId: user.organizationId,
  };
}

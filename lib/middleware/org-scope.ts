import { NextRequest, NextResponse } from 'next/server';
import { AuthUser } from './auth';
import { getUserFromRequest } from './getUserFromRequest';

/**
 * ORG-SCOPE MIDDLEWARE — BILLING / LICENSE GATE
 * 
 * Purpose: Enforce organization billing and verification authority
 * Applied ONLY AFTER auth, ONLY on /dashboard routes
 * 
 * Rules:
 * - Non-Enterprise: Require stripeSubscriptionStatus === "active"
 * - Enterprise/Regulator: Require verificationAuthority === true
 * - Otherwise → redirect /pricing
 * 
 * Does NOT:
 * - Calculate seats
 * - Mutate org state
 * - Infer plans
 */
export async function orgScope(req: NextRequest): Promise<NextResponse | null> {
  // Extract user (already authenticated by auth middleware)
  const user = getUserFromRequest(req);
  if (!user) {
    // Should never happen (auth middleware runs first)
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // TODO: Fetch organization from database
  // const org = await prisma.organization.findUnique({
  //   where: { id: user.organizationId },
  //   select: {
  //     type: true,
  //     stripeSubscriptionStatus: true,
  //     verificationAuthority: true,
  //   },
  // });

  // PLACEHOLDER: Mock organization for development
  const org = {
    type: 'general' as 'general' | 'enterprise' | 'regulator',
    stripeSubscriptionStatus: 'active' as 'active' | 'inactive' | 'canceled',
    verificationAuthority: true,
  };

  // Non-Enterprise organizations: Require active Stripe subscription
  if (org.type !== 'enterprise' && org.type !== 'regulator') {
    if (org.stripeSubscriptionStatus !== 'active') {
      return NextResponse.redirect(new URL('/pricing', req.url));
    }
  }

  // Enterprise/Regulator organizations: Require verification authority
  if (org.type === 'enterprise' || org.type === 'regulator') {
    if (!org.verificationAuthority) {
      return NextResponse.redirect(new URL('/pricing', req.url));
    }
  }

  // Billing/license checks passed, allow access
  return null;
}

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

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

/**
 * ORG-SCOPE MIDDLEWARE — BILLING / LICENSE GATE
 * 
 * Purpose: Enforce organization billing and subscription
 * Applied ONLY AFTER auth, ONLY on /dashboard routes
 * 
 * Rules:
 * - Require user belongs to organization
 * - Require organization.subscriptionStatus === "active"
 * - Otherwise → redirect /pricing
 */
export async function orgScope(req: NextRequest): Promise<NextResponse | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return null; // Auth middleware already handled this
  }

  // Load fresh organization data from database
  const user = await prisma.user.findUnique({
    where: { id: token.id as string },
    include: { organization: true }
  });

  if (!user?.organization) {
    const pricingUrl = new URL("/pricing", req.url);
    pricingUrl.searchParams.set("reason", "no_organization");
    return NextResponse.redirect(pricingUrl);
  }

  // STRIPE SUBSCRIPTION GATE - Enforce active subscription
  if (user.organization.subscriptionStatus !== 'active') {
    const pricingUrl = new URL("/pricing", req.url);
    pricingUrl.searchParams.set("reason", "subscription_required");
    return NextResponse.redirect(pricingUrl);
  }

  return null; // Allow request to proceed
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

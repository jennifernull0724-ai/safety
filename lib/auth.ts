/**
 * AUTH LAYER - REAL IMPLEMENTATION
 * 
 * Uses NextAuth with database-backed sessions
 * All user roles loaded from database
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

type UserRole = "admin" | "safety" | "dispatcher" | "supervisor" | "executive" | "operations" | "regulator";

interface Session {
  user: {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string | null;
    organization: {
      id: string;
      name: string;
      subscriptionStatus: string;
      pricingTier: string | null;
    } | null;
  };
}

/**
 * Get current session (server-side only)
 * Returns null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  // Load fresh user data from database to ensure role is current
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true }
  });

  if (!user || user.status !== 'active') {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      organizationId: user.organizationId,
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        subscriptionStatus: user.organization.subscriptionStatus,
        pricingTier: user.organization.pricingTier
      } : null
    }
  };
}

/**
 * Require specific roles
 * Throws if user doesn't have required role
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized - No valid session");
  }
  
  if (!allowedRoles.includes(session.user.role)) {
    // Log unauthorized access attempt
    await prisma.evidenceNode.create({
      data: {
        entityType: 'UnauthorizedAccess',
        entityId: session.user.id,
        actorType: 'user',
        actorId: session.user.id,
      }
    });
    
    throw new Error("Forbidden - Insufficient permissions");
  }
  
  return session;
}

/**
 * Require active subscription
 * Throws if organization has no active subscription
 */
export async function requireActiveSubscription(): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized - No valid session");
  }

  if (!session.user.organization) {
    throw new Error("No organization associated with user");
  }

  if (session.user.organization.subscriptionStatus !== 'active') {
    throw new Error("Subscription required - Please update billing");
  }

  return session;
}


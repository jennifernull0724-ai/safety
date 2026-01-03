// lib/middleware/getUserFromRequest.ts
import { NextRequest } from 'next/server';

/**
 * Extract authenticated user from request headers
 * (injected by global middleware.ts)
 */
export interface AuthUser {
  id: string;
  role: string;
  organizationId: string;
  email: string;
}

export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  const orgId = request.headers.get('x-org-id');
  const email = request.headers.get('x-user-email');

  if (!userId || !userRole || !orgId || !email) {
    return null;
  }

  return {
    id: userId,
    role: userRole,
    organizationId: orgId,
    email: email,
  };
}

export function requireUser(request: NextRequest): AuthUser {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Error('Unauthorized - User context missing');
  }
  return user;
}

export function requiresMutation(request: NextRequest): boolean {
  return request.headers.get('x-requires-evidence') === 'true';
}

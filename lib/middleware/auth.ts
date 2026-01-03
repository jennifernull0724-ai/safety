import { NextRequest, NextResponse } from 'next/server';

export interface AuthUser {
  id: string;
  role: 'admin' | 'supervisor' | 'dispatcher' | 'safety_officer' | 'executive' | 'regulator' | 'employee';
  organizationId: string;
  email: string;
}

// Placeholder for auth middleware - integrate with your auth provider
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  // TODO: Implement actual authentication (e.g., NextAuth, Auth0, Clerk)
  // For now, check for a session header or cookie
  const sessionId = req.headers.get('x-session-id') || req.cookies.get('session')?.value;
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
  }

  // Mock user for development - replace with actual session lookup
  const mockUser: AuthUser = {
    id: 'dev-user',
    role: 'admin',
    organizationId: 'dev-org',
    email: 'dev@example.com',
  };

  return handler(req, mockUser);
}

// Role-based access control
export function requireRole(...allowedRoles: AuthUser['role'][]) {
  return async (
    req: NextRequest,
    handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    return withAuth(req, async (req, user) => {
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: `Forbidden - Required roles: ${allowedRoles.join(', ')}` },
          { status: 403 }
        );
      }
      return handler(req, user);
    });
  };
}

// Fail-closed enforcement - if auth fails, deny access
export async function failClosedAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const sessionId = req.headers.get('x-session-id') || req.cookies.get('session')?.value;
    if (!sessionId) return null;
    
    // TODO: Validate session against database
    return {
      id: 'dev-user',
      role: 'admin',
      organizationId: 'dev-org',
      email: 'dev@example.com',
    };
  } catch {
    // Fail closed - any error means no access
    return null;
  }
}

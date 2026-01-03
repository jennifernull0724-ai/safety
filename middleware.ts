import { NextRequest, NextResponse } from "next/server";
import { publicQrReadOnly } from "@/lib/middleware/publicQrReadOnly";
import { internalAuth } from "@/lib/middleware/internalAuth";
import { auth } from "@/lib/middleware/auth";
import { orgScope } from "@/lib/middleware/org-scope";

/**
 * ROOT MIDDLEWARE DISPATCHER
 * 
 * Purpose: Route requests to appropriate middleware modules
 * Business logic lives in lib/middleware/* ONLY
 * 
 * PUBLIC ROUTES (NO CHECKS):
 * - /
 * - /login
 * - /create-account
 * - /pricing
 * 
 * PROTECTED ROUTES:
 * - /dashboard (auth + org-scope)
 * - /dashboard/* (auth + org-scope)
 */
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Public QR verification — READ ONLY
  if (pathname.startsWith("/verify/employee")) {
    return publicQrReadOnly(req);
  }

  // Internal APIs — auth + org scope
  if (pathname.startsWith("/api/internal")) {
    return internalAuth(req);
  }

  // Protected dashboard routes — auth + billing gate
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/(platform)")) {
    // 1. Authentication check
    const authResponse = await auth(req);
    if (authResponse) return authResponse; // Redirect to /login if unauthenticated

    // 2. Organization + billing/license gate
    const orgResponse = await orgScope(req);
    if (orgResponse) return orgResponse; // Redirect to /pricing if unpaid

    return NextResponse.next();
  }

  // All other routes (/, /login, /create-account, /pricing) — allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/verify/employee/:path*",
    "/api/internal/:path*",
    "/dashboard/:path*",
    "/(platform)/:path*",
  ],
};

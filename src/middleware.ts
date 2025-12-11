/**
 * Next.js middleware for authentication and route protection
 * Uses Clerk for authentication on protected routes
 * Temporarily redirects dashboard to projects page
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// ROUTE PROTECTION CONFIGURATION
// ============================================================================

/**
 * Matcher for protected routes that require authentication
 * Currently protects all dashboard routes and subroutes
 */
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// ============================================================================
// MIDDLEWARE FUNCTION
// ============================================================================

/**
 * Main middleware function that handles authentication and redirects
 * Protects routes matched by isProtectedRoute
 * Temporarily redirects /dashboard to /dashboard/projects
 */
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // ============================================================================
  // TEMPORARY DASHBOARD REDIRECT
  // ============================================================================

  // Temporarily redirect /dashboard to /dashboard/projects
  if (req.nextUrl.pathname === '/dashboard') {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard/projects';
    return NextResponse.redirect(url);
  }

  // ============================================================================
  // ROUTE PROTECTION
  // ============================================================================

  if (isProtectedRoute(req)) await auth.protect();
});

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Configuration for when middleware should run
 * Excludes Next.js internals and static files, always runs for API routes
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};

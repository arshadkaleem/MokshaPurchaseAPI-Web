import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * Runs on every request BEFORE the page loads
 * 
 * C# equivalent: Authorization middleware in Program.cs
 * 
 * app.UseAuthentication();
 * app.UseAuthorization();
 * 
 * Or [Authorize] attribute on controllers
 */

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value || 
                checkLocalStorageToken(request);
  
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isRootPath = request.nextUrl.pathname === '/';

  // Redirect root to dashboard or login
  if (isRootPath) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard/projects', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access protected route without token → redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Save the attempted URL to redirect back after login
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login page with valid token → redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard/projects', request.url));
  }

  return NextResponse.next();
}

/**
 * Helper to check localStorage token from client
 * Note: This is a simplified check. In production, verify the token server-side.
 */
function checkLocalStorageToken(request: NextRequest): string | null {
  // In browser, token is in localStorage
  // Middleware runs on server, so we can't access localStorage directly
  // We'll rely on cookie or accept that first request might not have token
  return null;
}

/**
 * Configure which routes this middleware runs on
 * 
 * C# equivalent: Configuring which routes require [Authorize]
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
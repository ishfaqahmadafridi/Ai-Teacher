import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global Next.js middleware.
 * Executes on every route request. Useful for auth guards, headers, and logs.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Logging Request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware Request] ${request.method} -> ${pathname}`);
  }

  // Request/Response Headers Setup
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Config matching: Apply middleware to all routes except static resources and next internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled by backend or rewrite proxy)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - icons (public icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};

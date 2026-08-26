import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy handler.
 * Replaces legacy middleware.ts to eliminate deprecation warnings.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Logging Request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Proxy Request] ${request.method} -> ${pathname}`);
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

// Config matching: Apply proxy to all routes except static resources and next internals
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

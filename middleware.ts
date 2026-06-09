import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Session cookie name — must match the cookie name used in lib/auth.ts
const SESSION_COOKIE_NAME = 'mahkota-drive-admin-session';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const pathname = request.nextUrl.pathname;

  // If visiting /admin (login page) while already logged in → redirect to dashboard
  if (pathname === '/admin' && sessionCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If visiting /admin/dashboard without session → redirect to login
  if (pathname.startsWith('/admin/dashboard') && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};

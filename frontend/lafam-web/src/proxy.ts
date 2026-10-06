import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has('access_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
    || request.nextUrl.pathname.startsWith('/register')
    || request.nextUrl.pathname.startsWith('/forgot-password')
    || request.nextUrl.pathname.startsWith('/reset-password');
  const isHomePage = request.nextUrl.pathname === '/';
  console.log('[PROXY]', {
    pathname: request.nextUrl.pathname,
    hasToken: request.cookies.has('access_token'),
    cookies: request.cookies.getAll().map(c => c.name),
});

  if (!hasToken && !isAuthPage && !isHomePage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
};
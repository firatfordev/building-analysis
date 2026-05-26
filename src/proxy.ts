import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { routing } from './i18n/routing';

// ─── next-intl middleware ──────────────────────────────────────────────────────
const intlMiddleware = createMiddleware(routing);

// ─── Auth constants ────────────────────────────────────────────────────────────
const AUTH_COOKIE = 'admin_session';

// Matches any locale-prefixed admin route, e.g. /en/admin or /tr/admin/buildings/…
const ADMIN_PATTERN = /^\/[a-z]{2}\/admin(\/|$)/;

// Login page itself is excluded from auth checks
const LOGIN_PATTERN = /^\/[a-z]{2}\/admin\/login(\/|$)/;

// ─── JWKS cache ────────────────────────────────────────────────────────────────
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJWKS() {
  const url = process.env.NEON_AUTH_JWKS_URL;
  if (!url) return null;
  if (!_jwks) _jwks = createRemoteJWKSet(new URL(url));
  return _jwks;
}

// ─── Token verification ────────────────────────────────────────────────────────
async function verifyToken(token: string): Promise<boolean> {
  // 1. Try Neon Auth JWKS
  const jwks = getJWKS();
  if (jwks) {
    try {
      await jwtVerify(token, jwks);
      return true;
    } catch {
      // Fall through to local secret
    }
  }

  // 2. Local HS256 JWT
  const secret = process.env.JWT_SECRET;
  if (secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

// ─── Combined middleware ───────────────────────────────────────────────────────
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin pages (except the login page itself)
  if (ADMIN_PATTERN.test(pathname) && !LOGIN_PATTERN.test(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    // No token → redirect to login
    if (!token) {
      const locale = pathname.split('/')[1] ?? 'en';
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url),
      );
    }

    // Invalid / expired token → clear cookie + redirect to login
    const valid = await verifyToken(token);
    if (!valid) {
      const locale = pathname.split('/')[1] ?? 'en';
      const res = NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url),
      );
      res.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
      return res;
    }
  }

  // All other routes: pass through next-intl for locale handling
  return intlMiddleware(request);
}

export const config = {
  // Skip api routes, Next.js internals and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

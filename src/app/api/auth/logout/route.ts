import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
// Clears the session cookie. Called from the admin dashboard logout button.
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,   // expire immediately
    path: '/',
  });
  return response;
}

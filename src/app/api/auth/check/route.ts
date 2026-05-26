import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

// GET /api/auth/check
// Returns { authenticated: true } if the session cookie is valid, else 401.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const valid = await verifyToken(token);
  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

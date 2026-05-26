import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createLocalJWT, AUTH_COOKIE, COOKIE_MAX_AGE } from '@/lib/auth';

// ─── Try Neon Auth (Stack Auth) password sign-in ───────────────────────────────
async function tryNeonAuth(email: string, password: string): Promise<string | null> {
  const authUrl      = process.env.NEON_AUTH_URL;
  const projectId    = process.env.NEON_AUTH_PROJECT_ID;
  const publishableKey = process.env.NEON_AUTH_PUBLISHABLE_KEY;

  // Only attempt if all three Neon Auth vars are set
  if (!authUrl || !projectId || !publishableKey) return null;

  try {
    const res = await fetch(`${authUrl}/api/v1/auth/password/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-stack-project-id': projectId,
        'x-stack-publishable-client-key': publishableKey,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;

    const data = await res.json() as { access_token?: string };
    return data.access_token ?? null;
  } catch (err) {
    console.error('[auth/login] Neon Auth request failed:', err);
    return null;
  }
}

// ─── Verify against ADMIN_EMAIL / ADMIN_PASSWORD env vars ─────────────────────
function verifyLocalCredentials(email: string, password: string): boolean {
  const adminEmail    = process.env.ADMIN_EMAIL ?? '';
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  if (!adminEmail || !adminPassword) return false;

  // Use constant-time comparison to prevent timing attacks
  const emailBuf    = Buffer.from(email.toLowerCase().padEnd(64));
  const adminBuf    = Buffer.from(adminEmail.toLowerCase().padEnd(64));
  const emailMatch  = crypto.timingSafeEqual(emailBuf, adminBuf);

  const pwBuf       = Buffer.from(password.padEnd(128));
  const adminPwBuf  = Buffer.from(adminPassword.padEnd(128));
  const pwMatch     = crypto.timingSafeEqual(pwBuf, adminPwBuf);

  // Both must match AND original lengths must be equal
  return emailMatch && pwMatch
    && email.toLowerCase() === adminEmail.toLowerCase()
    && password === adminPassword;
}

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const { email = '', password = '' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    let token: string | null = null;

    // 1. Try Neon Auth (requires NEON_AUTH_PROJECT_ID + NEON_AUTH_PUBLISHABLE_KEY)
    token = await tryNeonAuth(email, password);

    // 2. Fall back to local admin credentials
    if (!token) {
      if (!verifyLocalCredentials(email, password)) {
        return NextResponse.json(
          { error: 'Invalid email or password.' },
          { status: 401 },
        );
      }
      token = await createLocalJWT(email);
    }

    // Set HTTP-only session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

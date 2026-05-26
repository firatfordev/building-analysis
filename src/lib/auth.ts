import { jwtVerify, SignJWT, createRemoteJWKSet } from 'jose';

// ─── Constants ─────────────────────────────────────────────────────────────────
export const AUTH_COOKIE    = 'admin_session';
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is not set');
  return new TextEncoder().encode(secret);
}

// Cache the remote JWKS so we don't rebuild it on every request
let _remoteJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;
function getRemoteJWKS() {
  const url = process.env.NEON_AUTH_JWKS_URL;
  if (!url) return null;
  if (!_remoteJWKS) _remoteJWKS = createRemoteJWKSet(new URL(url));
  return _remoteJWKS;
}

/**
 * Verify a session token.
 *  1. Try Neon Auth JWKS (if NEON_AUTH_JWKS_URL is configured).
 *  2. Fall back to local HS256 JWT signed with JWT_SECRET.
 */
export async function verifyToken(token: string): Promise<boolean> {
  // 1. Neon Auth – verify with remote JWKS
  const jwks = getRemoteJWKS();
  if (jwks) {
    try {
      await jwtVerify(token, jwks);
      return true;
    } catch {
      // Token wasn't issued by Neon Auth – fall through
    }
  }

  // 2. Local HS256 JWT
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

/**
 * Issue a local HS256 JWT for an admin user (fallback when Neon Auth is not
 * fully configured with PROJECT_ID / PUBLISHABLE_KEY).
 */
export async function createLocalJWT(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
}

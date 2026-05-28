// Server-only: imported exclusively by Node-runtime route handlers.
import jwt from 'jsonwebtoken';
import type { AuthUser } from '@/lib/types';

const EXPIRY = '7d';

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (s) return s;
  // Zero-config local development; production must set a real secret.
  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-insecure-secret-do-not-use-in-production';
  }
  throw new Error('JWT_SECRET is not set');
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ email: user.email, name: user.name }, secret(), {
    subject: user.id,
    expiresIn: EXPIRY,
  });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, secret()) as jwt.JwtPayload;
    if (!payload.sub || typeof payload.email !== 'string') return null;
    return {
      id: String(payload.sub),
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : payload.email,
    };
  } catch {
    return null;
  }
}

/** Pull a Bearer token from an incoming request and verify it. */
export function authFromRequest(req: Request): AuthUser | null {
  const header = req.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return verifyToken(match[1].trim());
}

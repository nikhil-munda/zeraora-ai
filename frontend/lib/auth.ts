/**
 * Lightweight JWT utilities — runs in browser only (no server-side imports).
 * Token is stored in both localStorage (for app reads) and a cookie (for Next.js middleware).
 */

const TOKEN_KEY = 'on-ai-token';

export interface TokenPayload {
  sub: string;
  role: string;
  email?: string;
  iat: number;
  exp: number;
}

/** Decode a JWT payload without verifying (client-side only). */
export function decodeJwt(token: string): TokenPayload | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  // Also set a cookie so the Next.js Edge middleware can read it
  const decoded = decodeJwt(token);
  const maxAge = decoded ? decoded.exp - Math.floor(Date.now() / 1000) : 60 * 60 * 24 * 7;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function getUser(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeJwt(token);
}

export function isTokenExpired(): boolean {
  const user = getUser();
  if (!user) return true;
  return user.exp < Math.floor(Date.now() / 1000);
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_KEY = 'on-ai-token';

const PUBLIC_PATHS = ['/login', '/register'];

function base64UrlToString(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function verifyHs256Jwt(token: string, secret: string): Promise<Record<string, unknown>> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = JSON.parse(base64UrlToString(headerB64)) as { alg?: string; typ?: string };

  if (header.alg !== 'HS256') {
    throw new Error('Unsupported JWT algorithm');
  }

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlToBytes(signatureB64);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const isValid = await crypto.subtle.verify('HMAC', key, toArrayBuffer(signature), toArrayBuffer(data));
  if (!isValid) {
    throw new Error('Invalid JWT signature');
  }

  const payload = JSON.parse(base64UrlToString(payloadB64)) as Record<string, unknown>;
  const exp = typeof payload.exp === 'number' ? payload.exp : null;

  if (!exp || exp < Math.floor(Date.now() / 1000)) {
    throw new Error('JWT expired');
  }

  return payload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_KEY)?.value;

  // No token → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // If JWT_SECRET not available at edge, just allow (best-effort)
      return NextResponse.next();
    }

    const payload = await verifyHs256Jwt(token, secret);

    // Admin-only route check
    if (pathname.startsWith('/admin') && payload['role'] !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid / expired token → clear cookie and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(TOKEN_KEY);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - all _next paths
     * - favicon.ico
     * - api routes
     */
    '/((?!_next|favicon.ico|api).*)',
  ],
};

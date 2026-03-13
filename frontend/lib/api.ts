import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, { headers, ...rest });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message || 'An error occurred', res.status);
  }

  return res.json() as Promise<T>;
}

// ─── Auth endpoints ────────────────────────────────────────────────────────
export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export interface MeResponse {
  user: {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export const api = {
  auth: {
    register: (payload: RegisterPayload) =>
      request<{ message: string; user: AuthResponse['user'] }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuth: true,
      }),
    login: (payload: LoginPayload) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuth: true,
      }),
    me: () => request<MeResponse>('/auth/me'),
  },
};

export { ApiError };

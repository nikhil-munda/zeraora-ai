'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.auth.login({ email, password });
      setToken(data.token);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-lg px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </form>
  );
}

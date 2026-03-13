'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const inputBase =
    'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/50 hover:border-white/20 transition-all duration-200 text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-sm font-medium text-white/70">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={inputBase}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="login-password" className="block text-sm font-medium text-white/70">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className={`${inputBase} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3.5 flex items-center text-white/30 hover:text-white/60 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="relative">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded border border-white/20 bg-white/5 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 transition-all duration-200 flex items-center justify-center">
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
            Remember me
          </span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        id="login-btn"
        type="submit"
        disabled={loading}
        className="relative w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed
          bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
          shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)]
          active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/25 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Sign up */}
      <p className="text-center text-sm text-white/40">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          Sign up for free
        </Link>
      </p>
    </form>
  );
}

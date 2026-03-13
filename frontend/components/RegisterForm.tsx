'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.auth.register({ email, password });
      router.push('/login?registered=1');
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

  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-lg px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-foreground">
          Confirm password
        </label>
        <input
          id="reg-confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}

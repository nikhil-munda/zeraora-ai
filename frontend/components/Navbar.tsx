'use client';

import { useRouter } from 'next/navigation';
import { removeToken, getUser } from '@/lib/auth';
import { LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const user = getUser();

  function handleLogout() {
    removeToken();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-background/80 backdrop-blur-md flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-violet-400" />
        </div>
        <span className="font-bold text-lg gradient-text">ON-AI</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-semibold text-violet-300">
              {user.sub.charAt(0).toUpperCase()}
            </div>
            {user.role === 'admin' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 font-medium">
                Admin
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          id="logout-btn"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getUser } from '@/lib/auth';
import { Brain, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    // Also clear cookie
    document.cookie = 'on-ai-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-border glass sticky top-0 z-30 flex items-center px-6 gap-4">
      {/* Branding */}
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow group-hover:scale-105 transition-transform">
          <Brain size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg text-gradient hidden sm:block">On-AI</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          <Bell size={18} />
        </button>

        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium truncate max-w-[120px]">{user.email}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Sign out"
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
}

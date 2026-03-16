'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { MessageSquare, Library, History, Settings, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard/chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
  { href: '/dashboard/sources', label: 'Sources', icon: <Library className="w-4 h-4" /> },
  { href: '/dashboard/history', label: 'History', icon: <History className="w-4 h-4" /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { href: '/admin', label: 'Admin', icon: <Shield className="w-4 h-4" />, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getUser();
    setIsAdmin(user?.role === 'admin');
  }, []);

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-background/80 backdrop-blur-xl border-r border-white/10 flex flex-col hidden lg:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Zeraora AI
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-violet-500/15 border border-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10'
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-muted-foreground group-hover:text-foreground group-hover:bg-white/10"
              )}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="flex items-center px-3 py-2.5 bg-white/5 rounded-xl border border-white/5">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
           <p className="text-xs text-muted-foreground font-medium">System Online</p>
        </div>
      </div>
    </aside>
  );
}

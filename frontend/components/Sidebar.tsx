'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { LayoutDashboard, Shield, Database, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/admin', label: 'Admin', icon: <Shield className="w-4 h-4" />, adminOnly: true },
  { href: '/dashboard', label: 'Knowledge Base', icon: <Database className="w-4 h-4" /> },
  { href: '/dashboard', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="w-60 flex-shrink-0 border-r border-white/10 bg-background/60 backdrop-blur-md flex flex-col">
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-violet-500/15 border border-violet-500/20 text-violet-300'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground text-center">
          ON-AI v1.0 · Step 1
        </p>
      </div>
    </aside>
  );
}

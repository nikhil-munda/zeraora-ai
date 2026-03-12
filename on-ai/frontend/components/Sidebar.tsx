'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  Settings,
  Shield,
  BookOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Chat with AI', href: '/dashboard/chat', icon: MessageSquare },
  { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Data Sources', href: '/dashboard/sources', icon: Database },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Admin', href: '/admin', icon: Shield, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <aside className="w-60 min-h-[calc(100vh-4rem)] border-r border-border glass p-4 flex flex-col gap-1">
      {/* Nav section label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
        Navigation
      </p>

      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
              isActive
                ? 'gradient-primary text-white shadow-md glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon
              size={17}
              className={cn(
                'transition-transform duration-200 group-hover:scale-110',
                isActive ? 'text-white' : ''
              )}
            />
            {item.label}
            {item.adminOnly && (
              <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                Admin
              </span>
            )}
          </Link>
        );
      })}

      {/* Bottom section */}
      <div className="flex-1" />
      <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 mt-4">
        <p className="text-[10px] text-muted-foreground">Phase</p>
        <p className="text-xs font-semibold text-foreground mt-0.5">Step 1 — Auth</p>
        <div className="h-1.5 bg-secondary rounded-full mt-2">
          <div className="h-full w-1/4 gradient-primary rounded-full" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">RAG pipeline coming soon</p>
      </div>
    </aside>
  );
}

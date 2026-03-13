import type { Metadata } from 'next';
import { Shield, Users, BarChart2, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin — ON-AI',
};

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Manage users, system settings, and platform configuration.</p>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          {
            title: 'User Management',
            desc: 'View, create, and manage user accounts and roles.',
            icon: <Users className="w-6 h-6 text-violet-400" />,
            badge: 'Coming soon',
          },
          {
            title: 'Analytics',
            desc: 'Monitor platform usage, query volume, and performance.',
            icon: <BarChart2 className="w-6 h-6 text-indigo-400" />,
            badge: 'Coming soon',
          },
          {
            title: 'System Settings',
            desc: 'Configure AI models, vector database connections, and API keys.',
            icon: <Settings className="w-6 h-6 text-purple-400" />,
            badge: 'Coming soon',
          },
          {
            title: 'Ingestion Pipeline',
            desc: 'Manage document sources, processing status, and re-indexing.',
            icon: <Shield className="w-6 h-6 text-amber-400" />,
            badge: 'Step 2',
          },
        ].map((card) => (
          <div key={card.title} className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
                {card.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
                <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

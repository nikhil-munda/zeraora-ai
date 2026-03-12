import { Shield, Users, Activity, Settings } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard — On-AI',
  description: 'On-AI admin control panel',
};

const stats = [
  { label: 'Total Users', value: '—', icon: Users, note: 'Connect to analytics' },
  { label: 'Active Sessions', value: '—', icon: Activity, note: 'Connect to analytics' },
  { label: 'System Health', value: 'Healthy', icon: Activity, note: 'All systems operational' },
  { label: 'Config', value: 'v1.0', icon: Settings, note: 'Auth + base structure' },
];

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Shield size={20} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            System management &amp; user administration
          </p>
        </div>
        <span className="ml-auto text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-full">
          Admin Only
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
              <Icon size={18} className="text-muted-foreground mb-3" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.note}</p>
            </div>
          );
        })}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="glass rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">User Management</h2>
          </div>
          <div className="rounded-lg bg-secondary/50 border border-dashed border-border p-8 text-center">
            <Users size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-muted-foreground">User list coming in Step 2</p>
            <p className="text-xs text-muted-foreground mt-1">
              Manage roles, permissions, and sessions
            </p>
          </div>
        </div>

        {/* System Logs */}
        <div className="glass rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">System Logs</h2>
          </div>
          <div className="rounded-lg bg-secondary/50 border border-dashed border-border p-8 text-center">
            <Activity size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-muted-foreground">Audit logs coming in Step 2</p>
            <p className="text-xs text-muted-foreground mt-1">
              Track auth events and API usage
            </p>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <Shield size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400">This page is admin-restricted</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Only users with the <code className="bg-secondary px-1 py-0.5 rounded">admin</code> role can access this page.
            Regular users attempting to visit <code className="bg-secondary px-1 py-0.5 rounded">/admin</code> are automatically
            redirected to the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

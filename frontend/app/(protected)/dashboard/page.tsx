import type { Metadata } from 'next';
import { MessageSquare, Sparkles, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — ON-AI',
};

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Your AI knowledge workspace</p>
      </div>

      {/* Chat Placeholder */}
      <div className="glass-card p-8 mb-6 min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Chat with AI</h2>
        <p className="text-muted-foreground max-w-sm">
          AI chat will be available in Step 2. Your knowledge base will be connected here for multi-source RAG queries.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Coming soon
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Documents', value: '—', icon: <Zap className="w-5 h-5 text-violet-400" /> },
          { label: 'Queries', value: '—', icon: <MessageSquare className="w-5 h-5 text-indigo-400" /> },
          { label: 'Sources', value: '—', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

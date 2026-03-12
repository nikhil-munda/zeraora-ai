import { MessageSquare, Database, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard — On-AI',
  description: 'Your AI knowledge workspace',
};

const features = [
  {
    icon: MessageSquare,
    title: 'Chat with AI',
    description: 'Interact with your knowledge base via natural language',
    status: 'Coming Soon',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description: 'Organize and manage your AI-indexed documents',
    status: 'Coming Soon',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: Database,
    title: 'Multi-Source RAG',
    description: 'Connect PDFs, web pages, Notion, and more',
    status: 'Roadmap',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    icon: Zap,
    title: 'Smart Search',
    description: 'Semantic search across all your connected sources',
    status: 'Roadmap',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your AI knowledge workspace — Step 1 is live 🎉
        </p>
      </div>

      {/* Hero card */}
      <div className="glass rounded-2xl p-8 border border-primary/20 glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-3">
            <Zap size={14} />
            Authentication Active
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to On-AI
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Your authentication system is fully operational. The AI chat interface and
            multi-source RAG pipeline will be available in upcoming steps.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button size="sm" disabled className="opacity-60 cursor-not-allowed">
              <MessageSquare size={14} className="mr-2" />
              Chat with AI
            </Button>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Coming in Step 2 <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`glass rounded-xl p-5 border ${feature.bg} hover:scale-[1.01] transition-transform duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${feature.bg} border ${feature.bg}`}>
                    <Icon size={20} className={feature.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                      <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step progress */}
      <div className="glass rounded-xl p-5 border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4">Build Roadmap</h2>
        <div className="space-y-3">
          {[
            { step: 'Step 1', label: 'Authentication & Base Structure', done: true },
            { step: 'Step 2', label: 'Multi-Source RAG Pipeline', done: false },
            { step: 'Step 3', label: 'AI Chat Interface', done: false },
            { step: 'Step 4', label: 'Knowledge Base Management', done: false },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  item.done
                    ? 'gradient-primary text-white glow'
                    : 'bg-secondary border border-border text-muted-foreground'
                }`}
              >
                {item.done ? '✓' : ''}
              </div>
              <div className="flex-1 h-px bg-border" />
              <span className={`text-xs font-medium ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                <span className="font-bold">{item.step}</span> — {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

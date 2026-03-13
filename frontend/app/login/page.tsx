import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import {
  FileText,
  Github,
  Globe,
  Youtube,
  BookOpen,
  Sparkles,
  Cpu,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign in — ON-AI',
  description: 'Sign in to ON-AI — Always-on intelligence for your knowledge base.',
};

const SOURCES = [
  { icon: FileText, label: 'PDFs & Documents' },
  { icon: Github, label: 'GitHub Repositories' },
  { icon: Globe, label: 'Websites & URLs' },
  { icon: Youtube, label: 'YouTube Videos' },
  { icon: BookOpen, label: 'Research Papers' },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* ─── Left panel (hidden on mobile) ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Layered background gradients */}
        <div className="absolute inset-0 bg-[#050814]" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-[#050814] to-violet-950/60" />

        {/* Animated glow orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] animate-pulse [animation-delay:1.5s]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] animate-pulse [animation-delay:3s]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content — relative so it's above the bg layers */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ON-AI</span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300 tracking-wide">AI Knowledge Platform</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight mb-4">
            <span className="text-white">Always-on</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              intelligence.
            </span>
          </h1>

          <p className="text-base xl:text-lg text-white/50 leading-relaxed mb-10">
            Query knowledge across all your sources — in natural language, in seconds.
          </p>

          {/* Source pills */}
          <div className="flex flex-wrap gap-2.5">
            {SOURCES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/8 text-white/55 text-xs font-medium hover:bg-white/8 hover:text-white/80 transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400/80" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-xs text-white/20 tracking-widest uppercase">
            Secure · Private · Always available
          </p>
        </div>
      </div>

      {/* ─── Right panel — login card ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#080c1a] relative overflow-hidden">

        {/* Subtle background glow for right panel */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-indigo-900/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ON-AI</span>
          </div>

          {/* Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">

            {/* Card header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-sm text-white/40">Sign in to your ON-AI account</p>
            </div>

            <LoginForm />
          </div>

          {/* Bottom note */}
          <p className="mt-6 text-center text-xs text-white/20">
            By signing in, you agree to our{' '}
            <a href="#" className="text-white/35 hover:text-white/55 underline underline-offset-2 transition-colors">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-white/35 hover:text-white/55 underline underline-offset-2 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}

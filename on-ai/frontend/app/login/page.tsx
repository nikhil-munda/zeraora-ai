import LoginForm from '@/components/LoginForm';
import { Brain } from 'lucide-react';

export const metadata = {
  title: 'Sign In — On-AI',
  description: 'Sign in to your On-AI account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center glow">
            <Brain size={28} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient">On-AI</h1>
            <p className="text-muted-foreground text-sm mt-1">AI Knowledge Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to continue to your workspace</p>
          </div>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

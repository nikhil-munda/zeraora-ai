import RegisterForm from '@/components/RegisterForm';
import { Brain } from 'lucide-react';

export const metadata = {
  title: 'Create Account — On-AI',
  description: 'Create your On-AI account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

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
            <h2 className="text-xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground text-sm mt-1">Start your AI knowledge journey</p>
          </div>
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

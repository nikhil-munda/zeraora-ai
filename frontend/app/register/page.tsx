import type { Metadata } from 'next';
import RegisterForm from '@/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account — ON-AI',
  description: 'Create a new ON-AI account',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 mb-4">
            <span className="text-2xl font-bold gradient-text">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Join <span className="gradient-text">ON-AI</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Create your account to get started</p>
        </div>

        <div className="glass-card p-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

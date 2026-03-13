import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ON-AI — AI Knowledge Platform',
  description: 'Chat with your knowledge base. Multi-source RAG powered by AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}

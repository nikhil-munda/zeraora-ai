'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, type ChatMessageProps } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Sparkles, FileText, Code, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiError, api } from '@/lib/api';

const SUGGESTIONS = [
  {
    title: 'Summarize documents',
    description: 'Get a quick overview of recent uploads',
    icon: <FileText className="w-5 h-5 text-indigo-400" />
  },
  {
    title: 'Explain architecture',
    description: 'Understand the codebase structure',
    icon: <Code className="w-5 h-5 text-emerald-400" />
  },
  {
    title: 'Latest changes',
    description: 'What PRs were merged yesterday?',
    icon: <GitBranch className="w-5 h-5 text-rose-400" />
  }
];

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessageProps = { role: 'user', content, timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await api.chat.ask(content);
      const aiMsg: ChatMessageProps = {
        role: 'ai',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to get a response from the knowledge base.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `Request failed: ${message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto px-2 sm:px-6 relative">
      
      {/* Scrollable Chat Area */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto pb-6 scroll-smooth",
          messages.length === 0 ? "flex items-center justify-center p-4" : "pt-8"
        )}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 shadow-xl shadow-violet-500/5">
              <Sparkles className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-3">
              Ask anything about your <span className="gradient-text">knowledge base</span>
            </h1>
            <p className="text-muted-foreground text-center mb-10 max-w-md">
              Chat with ON-AI connected to your verified documents, repositories, YouTube videos, and notes.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => void handleSend(s.title)}
                  disabled={isTyping}
                  className="glass-card p-5 text-left transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] group"
                >
                  <div className="mb-3 p-2 w-fit rounded-lg bg-white/5 border border-white/10 group-hover:bg-background transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 w-full max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} {...msg} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start my-4">
                <div className="glass px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-fit">
                   <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area (Sticky to bottom) */}
      <div className="shrink-0 pb-4 sm:pb-8 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent w-full max-w-3xl mx-auto">
        <ChatInput onSend={handleSend} isLoading={isTyping} />
      </div>

    </div>
  );
}

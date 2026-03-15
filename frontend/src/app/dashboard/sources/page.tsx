'use client';

import { FileText, Globe, Github, Youtube, BookOpen } from 'lucide-react';
import { SourceCard } from '@/components/sources/SourceCard';
import { SourcesTable, type SourceData } from '@/components/sources/SourcesTable';
import { useState, useEffect, useCallback } from 'react';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SOURCE_TYPES = [
  {
    title: 'Upload PDF',
    description: 'Upload PDF files to index and query their contents.',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: 'Website',
    description: 'Crawl and index website content directly from a URL.',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    title: 'GitHub Repository',
    description: 'Index code and documentation from a public or private repo.',
    icon: <Github className="w-5 h-5" />,
  },
  {
    title: 'YouTube Video',
    description: 'Extract transcripts and index video content automatically.',
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: 'ArXiv Paper',
    description: 'Import research papers directly from the ArXiv database.',
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/sources`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setSources(data.sources);
      }
    } catch (err) {
      console.error('Failed to fetch sources', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-6">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Knowledge Sources</h1>
        <p className="text-muted-foreground">Connect documents, websites, and repositories to build your AI knowledge base.</p>
      </div>

      {/* Add Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {SOURCE_TYPES.map((source, index) => (
          <SourceCard 
            key={index} 
            {...source} 
            onSuccess={fetchSources} 
          />
        ))}
      </div>

      {/* Connected Sources Table Section */}
      <div className="pt-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Connected Sources</h2>
        <SourcesTable sources={sources} isLoading={isLoading} />
      </div>

    </div>
  );
}

'use client';

import { FormEvent, ReactNode, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface SourceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onSuccess?: () => void;
}

export function SourceCard({ title, description, icon, onSuccess }: SourceCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isWebsiteFormOpen, setIsWebsiteFormOpen] = useState(false);
  const [isGithubFormOpen, setIsGithubFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPdfSource = title === 'Upload PDF';
  const isWebsiteSource = title === 'Website';
  const isGithubSource = title === 'GitHub Repository';

  const handleCardClick = () => {
    if (isPdfSource && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (isWebsiteSource) {
      setIsWebsiteFormOpen((value) => !value);
    } else if (isGithubSource) {
      setIsGithubFormOpen((value) => !value);
    } else {
      // Future handler for websites, github, etc
      alert(`${title} integration coming soon!`);
    }
  };

  const handleWebsiteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUrl = websiteUrl.trim();
    if (!trimmedUrl) {
      alert('Please enter a website URL.');
      return;
    }

    try {
      setIsUploading(true);
      const token = getToken();
      if (!token) {
        throw new Error('You must be logged in to add a source');
      }

      const res = await fetch(`${API_URL}/sources/website`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error indexing website');
      }

      setUploadSuccess(true);
      setWebsiteUrl('');
      setIsWebsiteFormOpen(false);
      setTimeout(() => setUploadSuccess(false), 3000);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message || 'An error occurred while indexing the website.');
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleGithubSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedRepoUrl = repoUrl.trim();
    if (!trimmedRepoUrl) {
      alert('Please enter a GitHub repository URL.');
      return;
    }

    try {
      setIsUploading(true);
      const token = getToken();
      if (!token) {
        throw new Error('You must be logged in to add a source');
      }

      const res = await fetch(`${API_URL}/sources/github`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: trimmedRepoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error indexing repository');
      }

      setUploadSuccess(true);
      setRepoUrl('');
      setIsGithubFormOpen(false);
      setTimeout(() => setUploadSuccess(false), 3000);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message || 'An error occurred while indexing the repository.');
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
       alert('Only PDF files are supported.');
       return;
    }

    try {
      setIsUploading(true);
      const token = getToken();
      if (!token) {
        throw new Error('You must be logged in to upload a source');
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/sources/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error uploading file');
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      if (onSuccess) onSuccess();

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message || 'An error occurred during upload.');
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col group transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-4 relative">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-violet-300 transition-colors">{title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 relative">{description}</p>
      
      <div className="mt-6 pt-4 border-t border-white/10 relative">
        {isPdfSource && (
           <input 
             type="file" 
             className="hidden" 
             accept=".pdf" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             disabled={isUploading}
           />
        )}
        {isWebsiteSource && isWebsiteFormOpen && (
          <form onSubmit={handleWebsiteSubmit} className="mb-3 space-y-3">
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              disabled={isUploading}
            />
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 border border-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Indexing website...' : 'Index Website'}
            </button>
          </form>
        )}
        {isGithubSource && isGithubFormOpen && (
          <form onSubmit={handleGithubSubmit} className="mb-3 space-y-3">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              disabled={isUploading}
            />
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 border border-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Indexing repository...' : 'Index Repository'}
            </button>
          </form>
        )}
        {uploadSuccess && (
          <div className="mb-3 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Source added successfully!
          </div>
        )}
        <button 
          onClick={handleCardClick}
          disabled={isUploading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-violet-600 border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Added!
            </>
          ) : (
            (isWebsiteSource && isWebsiteFormOpen) || (isGithubSource && isGithubFormOpen)
              ? 'Close'
              : 'Add Source'
          )}
        </button>
      </div>
      
    </div>
  );
}

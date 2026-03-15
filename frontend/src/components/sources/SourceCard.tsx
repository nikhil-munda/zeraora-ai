'use client';

import { ReactNode, useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    if (title === 'Upload PDF' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Future handler for websites, github, etc
      alert(`${title} integration coming soon!`);
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
        {title === 'Upload PDF' && (
           <input 
             type="file" 
             className="hidden" 
             accept=".pdf" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             disabled={isUploading}
           />
        )}
        {uploadSuccess && (
          <div className="mb-3 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Uploaded successfully!
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
              Uploaded!
            </>
          ) : (
            "Add Source"
          )}
        </button>
      </div>
      
    </div>
  );
}

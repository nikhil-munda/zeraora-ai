'use client';

import { FileText, Globe, Github, MoreVertical, Search } from 'lucide-react';

export interface SourceData {
  _id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

interface SourcesTableProps {
  sources: SourceData[];
  isLoading?: boolean;
}

const getIconForType = (type: string) => {
   switch (type.toLowerCase()) {
     case 'pdf': return <FileText className="w-4 h-4 text-violet-400" />;
     case 'website': return <Globe className="w-4 h-4 text-blue-400" />;
     case 'github': return <Github className="w-4 h-4 text-slate-400" />;
     default: return <FileText className="w-4 h-4 text-muted-foreground" />;
   }
}

export function SourcesTable({ sources, isLoading }: SourcesTableProps) {
  const getStatusClasses = (status: string) => {
    if (status === 'indexed') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }

    if (status === 'failed') {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }

    return 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse';
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
         <div className="relative w-64">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <input 
             type="text" 
             placeholder="Search sources..." 
             className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50 placeholder:text-muted-foreground"
           />
         </div>
         <div className="text-sm text-muted-foreground font-medium bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
           Total: {sources.length}
         </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium tracking-wider">Source</th>
              <th scope="col" className="px-6 py-4 font-medium tracking-wider">Type</th>
              <th scope="col" className="px-6 py-4 font-medium tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 font-medium tracking-wider">Added At</th>
              <th scope="col" className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
               <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-400 animate-spin rounded-full" />
                    Loading connected sources...
                  </div>
                </td>
              </tr>
            ) : sources.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No sources connected yet.
                </td>
              </tr>
            ) : (
              sources.map((source) => (
                <tr key={source._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
                      {getIconForType(source.type)}
                    </div>
                    {source.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground uppercase text-xs font-semibold">
                    {source.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(source.status)}`}>
                      {source.status === 'processing' ? 'Processing...' : source.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(source.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

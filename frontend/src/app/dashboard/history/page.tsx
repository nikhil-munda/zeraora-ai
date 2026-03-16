"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Trash2, MessageSquare, ChevronDown, ChevronUp, Bot, User, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Source {
  type: string;
  name?: string;
  url?: string;
  file?: string;
}

interface HistoryItem {
  _id: string;
  question: string;
  answer: string;
  sources: Source[];
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
        withCredentials: true,
      });
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      toast({
        title: "Error",
        description: "Failed to load history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [toast]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
        withCredentials: true,
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: "Success",
        description: "History item deleted",
      });
    } catch (error) {
      console.error("Failed to delete history item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-xl p-8 border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground mt-2">
            View your previous conversations and AI responses.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-1">
          {history.length} {history.length === 1 ? 'Conversation' : 'Conversations'}
        </Badge>
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-4 opacity-20" />
            <p>No history found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card 
                key={item._id} 
                className={`transition-all duration-200 cursor-pointer border-slate-800 ${expandedId === item._id ? 'bg-slate-900/50' : 'hover:bg-slate-900/30 bg-slate-950'}`}
                onClick={() => toggleExpand(item._id)}
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div className="flex gap-4 items-start w-full">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-base font-medium leading-relaxed">
                        {item.question}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-2">
                        {format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        {item.sources.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              {item.sources.length} sources
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                        onClick={(e) => handleDelete(item._id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        {expandedId === item._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedId === item._id && (
                  <CardContent className="p-4 pt-2 border-t border-slate-800 mt-2">
                    <div className="flex gap-4 mt-4">
                      <div className="bg-blue-500/10 p-2 rounded-full h-fit">
                        <Bot className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                          {item.answer.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                        
                        {item.sources && item.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-800">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
                              <Database className="h-3 w-3" />
                              Sources Used
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.sources.map((source, i) => (
                                <Badge key={i} variant="secondary" className="bg-slate-800 hover:bg-slate-700">
                                  {source.type.toUpperCase()}: {source.name || source.file || source.url || 'Unknown'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

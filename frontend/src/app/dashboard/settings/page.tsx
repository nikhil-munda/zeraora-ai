"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Settings as SettingsIcon, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  model: string;
  temperature: number;
  top_k: number;
  allowed_sources: string[];
  show_sources: boolean;
}

const AVAILABLE_MODELS = ["GPT-4", "Claude", "Llama3", "Mistral"];
const AVAILABLE_SOURCES = [
  { id: "pdf", label: "PDF Documents" },
  { id: "website", label: "Websites" },
  { id: "github", label: "GitHub Repositories" },
  { id: "youtube", label: "YouTube Transcripts" },
  { id: "arxiv", label: "ArXiv Papers" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    model: "GPT-4",
    temperature: 0.7,
    top_k: 5,
    allowed_sources: ["pdf", "website", "github", "youtube", "arxiv"],
    show_sources: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
          withCredentials: true,
        });
        if (res.data) {
          setSettings(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast({
          title: "Error",
          description: "Could not load your settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/settings`, settings, {
        withCredentials: true,
      });
      toast({
        title: "Success",
        description: "Your settings have been saved",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    setSettings((prev) => {
      const current = prev.allowed_sources;
      const updated = current.includes(sourceId)
        ? current.filter((id) => id !== sourceId)
        : [...current, sourceId];
      return { ...prev, allowed_sources: updated };
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your AI behavior preferences and generation parameters.</p>
      </div>

      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader className="border-b border-slate-800 pb-6 mb-6">
          <CardTitle>AI Configuration</CardTitle>
          <CardDescription>Adjust how the assistant answers your queries.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Language Model</label>
            <select 
              className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500">Select the underlying AI model for generating responses.</p>
          </div>

          {/* Temperature */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">Temperature: {settings.temperature}</label>
              <span className="text-xs text-slate-500">{settings.temperature < 0.3 ? 'More Focused' : settings.temperature > 0.7 ? 'More Creative' : 'Balanced'}</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.1" 
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
            />
            <p className="text-xs text-slate-500">Higher values produce more creative but less deterministic outputs.</p>
          </div>

          {/* Top K Retrieval */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="text-sm font-medium text-slate-200">Top-K Context Chunks</label>
            <input 
              type="number" 
              min="1" max="20"
              className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              value={settings.top_k}
              onChange={(e) => setSettings({ ...settings, top_k: parseInt(e.target.value) || 5 })}
            />
            <p className="text-xs text-slate-500">The number of relevant source chunks to retrieve for context per query.</p>
          </div>

          {/* Allowed Sources */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-sm font-medium text-slate-200">Allowed Retrieval Sources</label>
              <p className="text-xs text-slate-500 mt-1">Select which source types the AI is allowed to read from.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVAILABLE_SOURCES.map((source) => (
                <label key={source.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900 bg-slate-800"
                    checked={settings.allowed_sources.includes(source.id)}
                    onChange={() => handleSourceToggle(source.id)}
                  />
                  <span className="text-sm text-slate-200 font-medium">{source.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Show Citations */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer p-4 rounded-lg border border-slate-800 bg-slate-900/50">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Show Citations</span>
                <span className="text-xs text-slate-500 block mt-1">Append the retrieved sources at the end of AI responses.</span>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.show_sources}
                  onChange={(e) => setSettings({ ...settings, show_sources: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </label>
          </div>
        </CardContent>

        <CardFooter className="border-t border-slate-800 pt-6 mt-2 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Prompt, PromptVersion } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Save, History, Share } from "lucide-react";
import VersionTimeline from "@/components/VersionTimeline";
import AIAssistant from "@/components/AIAssistant";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PromptDetailPage({ params }: PageProps) {
  const { id } = params;
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPromptAndVersions();
    }
  }, [user, id]);

  async function loadPromptAndVersions() {
    // Load prompt details
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .single();

    if (promptError) {
      console.error("Error loading prompt:", promptError);
      return;
    }

    // Load all versions
    const { data: versionsData, error: versionsError } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("prompt_id", id)
      .order("version_number", { ascending: false });

    if (versionsError) {
      console.error("Error loading versions:", versionsError);
      return;
    }

    setPrompt(promptData);
    setVersions(versionsData);

    // Set content to latest version
    if (versionsData.length > 0) {
      setContent(versionsData[0].content);
      setCurrentVersion(versionsData[0].version_number);
    }
  }

  const handleSave = async () => {
    if (!prompt || !content.trim()) return;

    setIsSaving(true);
    const newVersion = currentVersion + 1;

    const { error } = await supabase.from("prompt_versions").insert({
      prompt_id: prompt.id,
      content: content.trim(),
      version_number: newVersion,
    });

    if (error) {
      console.error("Error saving version:", error);
      setIsSaving(false);
      return;
    }

    setHasChanges(false);
    setIsSaving(false);
    loadPromptAndVersions();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setHasChanges(newContent !== versions[0]?.content);
  };

  if (!prompt) return <div>Loading...</div>;

  return (
    <div className="h-screen flex">
      {/* Version History Timeline (Left 25%) */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <VersionTimeline
          versions={versions}
          currentVersion={currentVersion}
          onVersionSelect={(version) => {
            setContent(version.content);
            setCurrentVersion(version.version_number);
            setHasChanges(false);
          }}
        />
      </div>

      {/* Editor Section (Center 75%) */}
      <div className="w-3/4 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1 className="text-xl font-semibold">{prompt.title}</h1>
            <p className="text-sm text-muted-foreground">
              Version {currentVersion}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 p-4">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full min-h-[500px] p-4 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            placeholder="Enter your prompt here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

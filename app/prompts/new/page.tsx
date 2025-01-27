"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function NewPromptPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Profile check:", { data, error });

      if (!data) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, email: user.email });

        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      }
    }

    checkProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) return;

    setIsSaving(true);

    // First create the prompt
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .insert({
        title: title.trim(),
        user_id: user.id,
      })
      .select()
      .single();

    if (promptError) {
      console.error("Error creating prompt:", promptError);
      setIsSaving(false);
      return;
    }

    // Then create the initial version
    const { error: versionError } = await supabase
      .from("prompt_versions")
      .insert({
        prompt_id: promptData.id,
        content: content.trim(),
        version_number: 1,
      });

    setIsSaving(false);

    if (versionError) {
      console.error("Error creating version:", versionError);
      return;
    }

    router.push(`/prompts/${promptData.id}`);
  };

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-3xl mx-auto flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            placeholder="Enter prompt title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold max-w-md"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Prompt
              </>
            )}
          </Button>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[500px] p-4 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            placeholder="Enter your prompt here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

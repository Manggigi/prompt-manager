"use client";

import { Prompt } from "@/types/database.types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, MoreVertical, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PromptCardProps {
  prompt: Prompt;
  onUpdate: () => void;
}

export default function PromptCard({ prompt, onUpdate }: PromptCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    // First delete all versions
    const { error: versionsError } = await supabase
      .from("prompt_versions")
      .delete()
      .eq("prompt_id", prompt.id);

    if (versionsError) {
      console.error("Error deleting versions:", versionsError);
      return;
    }

    // Then delete the prompt
    const { error: promptError } = await supabase
      .from("prompts")
      .delete()
      .eq("id", prompt.id);

    if (promptError) {
      console.error("Error deleting prompt:", promptError);
      return;
    }

    onUpdate();
  };

  return (
    <div
      className="group bg-card rounded-lg shadow-sm border p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => router.push(`/prompts/${prompt.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{prompt.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(prompt.created_at)}
        </span>
      </div>
    </div>
  );
}

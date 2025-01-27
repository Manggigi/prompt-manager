"use client";

import { Prompt, PromptVersion } from "@/types/database.types";
import { formatDate, generateVersionLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface VersionTimelineProps {
  versions: PromptVersion[];
  currentVersion: number;
  onVersionSelect: (version: PromptVersion) => void;
}

export default function VersionTimeline({
  versions,
  currentVersion,
  onVersionSelect,
}: VersionTimelineProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Version History</h2>
      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
              version.version_number === currentVersion
                ? "bg-accent"
                : "hover:bg-accent/50"
            }`}
            onClick={() => onVersionSelect(version)}
          >
            <div className="mt-1">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {generateVersionLabel(version.version_number)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(version.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

interface AIAssistantProps {
  content: string;
}

export default function AIAssistant({ content }: AIAssistantProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">AI Assistant</h2>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-accent/50">
          <h3 className="font-medium mb-2">Suggestions</h3>
          <p className="text-sm text-muted-foreground">
            AI suggestions will appear here...
          </p>
        </div>
        <div className="p-4 rounded-lg bg-accent/50">
          <h3 className="font-medium mb-2">Version Summary</h3>
          <p className="text-sm text-muted-foreground">
            AI summary will appear here...
          </p>
        </div>
      </div>
    </div>
  );
}

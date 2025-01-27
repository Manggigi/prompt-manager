export interface Profile {
  id: string;
  email: string;
  username: string;
}

export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  content: string;
  version_number: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id">;
        Update: Partial<Profile>;
      };
      prompts: {
        Row: Prompt;
        Insert: Omit<Prompt, "id" | "created_at">;
        Update: Partial<Prompt>;
      };
      prompt_versions: {
        Row: PromptVersion;
        Insert: Omit<PromptVersion, "id" | "created_at">;
        Update: Partial<PromptVersion>;
      };
    };
  };
}

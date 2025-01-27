# Next.js + Supabase + Tailwind CSS Prompt Management System Requirements

## Core Functionality Requirements

1. **Multi-User Support**

   - Authentication integration with Supabase Auth
   - Data isolation between users
   - User profile management

2. **Prompt Management Features**

   - Create/Update/Delete prompts with version history
   - Prompt comparison between versions
   - Full CRUD operations for prompts
   - Version history tracking with timestamps

3. **Dynamic Routing**
   - `/prompts` - Main list view
   - `/prompts/[id]` - Individual prompt detail view
   - `/prompts/new` - Create new prompt

## Database Structure (Supabase)

```sql
-- Profiles table for public user data
create table profiles (
  id uuid references auth.users primary key,
  email text,
  username text
);

-- Prompts table with version history
create table prompts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  title text not null,
  content text not null,
  version integer default 1,
  parent_version_id uuid references prompts(id),
  created_at timestamp with time zone default now()
);

UI/UX Requirements
1. Main Page (/prompts)
- **Layout**:
  - Responsive grid layout with cards
  - Floating action button for new prompts
  - Search bar at top

- **Prompt Cards**:
  - Title + first 100 characters preview
  - Version number and last modified time
  - Badge showing uncommitted changes
  - Context menu (Edit/Delete/History)

- **Features**:
  - Sort by modified date/version/name
  - Filter by modified status
  - Bulk selection actions


2. Prompt Detail Page (/prompts/[id])
- **Three-Column Layout**:
  1. Version History Timeline (Left 25%)
  2. Prompt Editor/Comparison (Center 50%)
  3. AI Assistant/Notes (Right 25%)

- **Version History Panel**:
  - Vertical timeline with version numbers
  - Interactive version diffs on hover
  - Visual indicators for published vs draft
  - Branching visualization for divergent versions

- **Editor Section**:
  - Monaco-like code editor with:
    - Line numbers
    - Syntax highlighting
    - AI autocomplete
  - Split-screen comparison mode
  - Version restore capabilities
  - Collaborative editing indicators

- **Action Bar**:
  - Publish/Discard changes
  - Version comparison toggle
  - Export as JSON/Markdown
  - Share via generated link


Component Requirements
Version Timeline Component

Interactive SVG-based timeline

Drag-to-reorder versions

Visual merge conflict indicators

Diff Viewer

Side-by-side comparison

Word-level diff highlighting

Fullscreen mode

Export diff as PDF/image

AI Integration

Prompt optimization suggestions

Version summarization

Change impact analysis

Automated version tagging

Technical Requirements
State Management

Version history caching

Draft autosave functionality

Offline-first support

Performance

Virtualized version lists

Differential data loading

Background sync for updates

Security

Row-level security policies

Version signing/verification

Edit conflict resolution

Supabase Integration Points
Realtime Updates

Prompt version updates

Collaborative editing presence

Edge Functions

Version diffs calculation

AI suggestions generation

Export file generation

Storage

Prompt version archives

Export file storage

User avatars

Tailwind CSS Requirements
Design System

Version status color palette

Diff highlighting theme

Dark/light mode support

Responsive Breakpoints

Mobile-first timeline

Adaptive editor layout

Context-aware action bars
```

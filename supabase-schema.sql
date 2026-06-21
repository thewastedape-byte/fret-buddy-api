-- Fret Buddy Supabase Schema
-- Run this in the Supabase SQL editor at: https://supabase.com/dashboard/project/yruuzkxpnbgruwuivchy/sql

-- Users table
CREATE TABLE IF NOT EXISTS fret_buddy_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  password_hash text,
  subscription text DEFAULT 'free',
  skill_level text DEFAULT 'beginner',
  preferred_bpm integer DEFAULT 80,
  preferred_time_sig text DEFAULT '4/4',
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

-- Sessions table (lesson conversations)
CREATE TABLE IF NOT EXISTS fret_buddy_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES fret_buddy_users(id) ON DELETE CASCADE,
  topic text,
  messages jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS fret_buddy_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES fret_buddy_users(id) ON DELETE CASCADE,
  skill text NOT NULL,
  level integer DEFAULT 0,
  last_practiced timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fret_buddy_users_email ON fret_buddy_users(email);
CREATE INDEX IF NOT EXISTS idx_fret_buddy_sessions_user_id ON fret_buddy_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_fret_buddy_progress_user_id ON fret_buddy_progress(user_id);

-- RLS (Row Level Security) - disabled for service role access
ALTER TABLE fret_buddy_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE fret_buddy_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE fret_buddy_progress DISABLE ROW LEVEL SECURITY;

-- Create cake_projects table to store saved cake designs
CREATE TABLE IF NOT EXISTS cake_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  tiers JSONB NOT NULL, -- Stores array of tier objects
  decorations JSONB NOT NULL, -- Stores array of decoration objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS cake_projects_user_id_idx ON cake_projects(user_id);

-- Enable Row Level Security
ALTER TABLE cake_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own projects
DROP POLICY IF EXISTS enable_read_own_projects ON cake_projects;
CREATE POLICY enable_read_own_projects ON cake_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own projects
DROP POLICY IF EXISTS enable_insert_own_projects ON cake_projects;
CREATE POLICY enable_insert_own_projects ON cake_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own projects
DROP POLICY IF EXISTS enable_update_own_projects ON cake_projects;
CREATE POLICY enable_update_own_projects ON cake_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy: Users can only delete their own projects
DROP POLICY IF EXISTS enable_delete_own_projects ON cake_projects;
CREATE POLICY enable_delete_own_projects ON cake_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create community_sketches table for template sketches (read-only for users)
CREATE TABLE IF NOT EXISTS community_sketches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tiers JSONB NOT NULL,
  decorations JSONB NOT NULL,
  cake_image_url VARCHAR(500),
  sketch_image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS community_sketches_slug_idx ON community_sketches(slug);

-- Enable Row Level Security
ALTER TABLE community_sketches ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Anyone can read community sketches
DROP POLICY IF EXISTS enable_read_all_sketches ON community_sketches;
CREATE POLICY enable_read_all_sketches ON community_sketches
  FOR SELECT USING (true);

-- Create RLS policy: Authenticated users can publish community sketches
DROP POLICY IF EXISTS enable_insert_community_sketches ON community_sketches;
CREATE POLICY enable_insert_community_sketches ON community_sketches
  FOR INSERT TO authenticated WITH CHECK (true);

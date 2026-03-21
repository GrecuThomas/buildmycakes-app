-- Create cake_projects table to store saved cake designs
CREATE TABLE cake_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  tiers JSONB NOT NULL, -- Stores array of tier objects
  decorations JSONB NOT NULL, -- Stores array of decoration objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX cake_projects_user_id_idx ON cake_projects(user_id);

-- Enable Row Level Security
ALTER TABLE cake_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own projects
CREATE POLICY enable_read_own_projects ON cake_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own projects
CREATE POLICY enable_insert_own_projects ON cake_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own projects
CREATE POLICY enable_update_own_projects ON cake_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy: Users can only delete their own projects
CREATE POLICY enable_delete_own_projects ON cake_projects
  FOR DELETE USING (auth.uid() = user_id);

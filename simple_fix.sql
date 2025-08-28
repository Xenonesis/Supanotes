-- Simple Fix - Just create the basic table
-- If you're getting 400 errors, the table might not exist at all

-- Drop and recreate the table completely
DROP TABLE IF EXISTS notes CASCADE;

-- Create the notes table from scratch
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    content_type TEXT CHECK (content_type IN ('text', 'audio', 'image')) NOT NULL DEFAULT 'text',
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Enable all for authenticated users" ON notes
    FOR ALL USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_notes_user_id_created_at ON notes(user_id, created_at DESC);
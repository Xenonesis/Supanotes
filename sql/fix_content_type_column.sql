-- Fix for "Could not find the 'content_type' column" error
-- Run these commands in your Supabase SQL Editor one by one

-- Step 1: Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'notes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: If the table exists but missing content_type column, add it
DO $$
BEGIN
    -- Check if content_type column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_name = 'notes' 
        AND table_schema = 'public'
        AND column_name = 'content_type'
    ) THEN
        -- Add the missing column
        ALTER TABLE notes ADD COLUMN content_type TEXT CHECK (content_type IN ('text', 'audio', 'image', 'mixed')) NOT NULL DEFAULT 'text';
        RAISE NOTICE 'Added content_type column to notes table';
    ELSE
        RAISE NOTICE 'content_type column already exists';
    END IF;
END $$;

-- Step 3: If table doesn't exist at all, create it
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    content_type TEXT CHECK (content_type IN ('text', 'audio', 'image', 'mixed')) NOT NULL DEFAULT 'text',
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id_created_at ON notes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_content_type ON notes(content_type);

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;

-- Step 7: Create RLS policies
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Step 8: Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 9: Create the trigger (drop if exists first)
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Verify the final table structure
SELECT 'Final table structure:' as status;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'notes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 11: Test insert to verify everything works
INSERT INTO notes (user_id, content, content_type) 
SELECT auth.uid(), 'Test note content', 'text'
WHERE auth.uid() IS NOT NULL;

SELECT 'Test completed successfully!' as status;

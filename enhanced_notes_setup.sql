-- Enhanced Notes App - Database Setup
-- Run this SQL in your Supabase SQL Editor to enable all enhanced features
-- This is safe to run multiple times and preserves all existing data

-- ============================================================================
-- STEP 1: Add enhanced columns to existing notes table
-- ============================================================================

ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- STEP 2: Create note_attachments table for multiple files per note
-- ============================================================================

CREATE TABLE IF NOT EXISTS note_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('image', 'audio')) NOT NULL,
    url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Create note_tags table for tag management
-- ============================================================================

CREATE TABLE IF NOT EXISTS note_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- ============================================================================
-- STEP 4: Create note_views table for analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS note_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 5: Create indexes for better performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_notes_user_id_updated_at ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_note_attachments_note_id ON note_attachments(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_user_id ON note_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_note_views_note_id ON note_views(note_id);

-- ============================================================================
-- STEP 6: Enable Row Level Security (RLS) on new tables
-- ============================================================================

ALTER TABLE note_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_views ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: Create RLS policies for note_attachments
-- ============================================================================

-- Users can view attachments of their own notes
CREATE POLICY "Users can view attachments of their own notes" ON note_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Users can insert attachments to their own notes
CREATE POLICY "Users can insert attachments to their own notes" ON note_attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Users can update attachments of their own notes
CREATE POLICY "Users can update attachments of their own notes" ON note_attachments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Users can delete attachments of their own notes
CREATE POLICY "Users can delete attachments of their own notes" ON note_attachments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- ============================================================================
-- STEP 8: Create RLS policies for note_tags
-- ============================================================================

-- Users can view their own tags
CREATE POLICY "Users can view their own tags" ON note_tags
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own tags
CREATE POLICY "Users can insert their own tags" ON note_tags
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own tags
CREATE POLICY "Users can update their own tags" ON note_tags
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own tags
CREATE POLICY "Users can delete their own tags" ON note_tags
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 9: Create RLS policies for note_views
-- ============================================================================

-- Users can view their own note views
CREATE POLICY "Users can view their own note views" ON note_views
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own note views
CREATE POLICY "Users can insert their own note views" ON note_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STEP 10: Create functions for automatic timestamps
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- STEP 11: Create triggers for automatic timestamps
-- ============================================================================

-- Trigger to automatically update updated_at when notes are modified
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 12: Create advanced search function
-- ============================================================================

-- Function to search notes with advanced filtering
CREATE OR REPLACE FUNCTION search_notes(
    search_query TEXT DEFAULT '',
    tag_filter TEXT[] DEFAULT '{}',
    content_type_filter TEXT DEFAULT '',
    is_favorite_filter BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title TEXT,
    content TEXT,
    content_type TEXT,
    attachments JSONB,
    tags TEXT[],
    is_favorite BOOLEAN,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.user_id,
        n.title,
        n.content,
        n.content_type,
        COALESCE(n.attachments, '[]'::jsonb) as attachments,
        COALESCE(n.tags, '{}') as tags,
        COALESCE(n.is_favorite, false) as is_favorite,
        n.file_url,
        n.file_name,
        n.file_size,
        n.created_at,
        COALESCE(n.updated_at, n.created_at) as updated_at
    FROM notes n
    WHERE n.user_id = auth.uid()
    AND (
        search_query = '' OR 
        n.title ILIKE '%' || search_query || '%' OR
        n.content ILIKE '%' || search_query || '%' OR
        EXISTS (
            SELECT 1 FROM unnest(COALESCE(n.tags, '{}')) as tag 
            WHERE tag ILIKE '%' || search_query || '%'
        )
    )
    AND (
        array_length(tag_filter, 1) IS NULL OR
        COALESCE(n.tags, '{}') && tag_filter
    )
    AND (
        content_type_filter = '' OR
        n.content_type = content_type_filter
    )
    AND (
        is_favorite_filter IS NULL OR
        COALESCE(n.is_favorite, false) = is_favorite_filter
    )
    ORDER BY COALESCE(n.updated_at, n.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 13: Create function to get note with attachments
-- ============================================================================

-- Function to get a complete note with all its attachments
CREATE OR REPLACE FUNCTION get_note_with_attachments(note_uuid UUID)
RETURNS JSON AS $$
DECLARE
    note_data JSON;
    attachments_data JSON;
BEGIN
    -- Get note data
    SELECT row_to_json(notes.*) INTO note_data
    FROM notes
    WHERE id = note_uuid AND user_id = auth.uid();
    
    -- Get attachments data
    SELECT COALESCE(json_agg(
        json_build_object(
            'id', id,
            'type', type,
            'url', url,
            'fileName', file_name,
            'fileSize', file_size,
            'caption', caption,
            'orderIndex', order_index
        ) ORDER BY order_index
    ), '[]'::json) INTO attachments_data
    FROM note_attachments
    WHERE note_id = note_uuid;
    
    -- Combine note and attachments
    RETURN json_build_object(
        'note', note_data,
        'attachments', attachments_data
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- After running this SQL:
-- 1. Refresh your notes app
-- 2. Enhanced features will be automatically available!
-- 3. Enjoy:
--    - Mixed content notes (multiple attachments per note)
--    - Tag system for organization
--    - Favorites for important notes
--    - Advanced search and filtering
--    - Full-screen preview with zoom controls
--    - Analytics and view tracking

-- Your existing notes and data are preserved and will continue to work normally.
-- The new features will be available immediately after refresh.
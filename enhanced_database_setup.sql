-- Enhanced Supabase Database Setup for Notes App with Preview and Mixed Content
-- Run these commands in your Supabase SQL Editor

-- 1. Create the enhanced notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    content TEXT,
    content_type TEXT CHECK (content_type IN ('text', 'audio', 'image', 'mixed')) NOT NULL DEFAULT 'text',
    attachments JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    -- Legacy fields for backward compatibility
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create note_attachments table for better file management
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

-- 3. Create tags table for better tag management
CREATE TABLE IF NOT EXISTS note_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- 4. Create note_views table for tracking previews and analytics
CREATE TABLE IF NOT EXISTS note_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id_created_at ON notes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_user_id_updated_at ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_content_type ON notes(content_type);
CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_note_attachments_note_id ON note_attachments(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_user_id ON note_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_note_views_note_id ON note_views(note_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_views ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for notes
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;

CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Create RLS policies for note_attachments
CREATE POLICY "Users can view attachments of their own notes" ON note_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert attachments to their own notes" ON note_attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update attachments of their own notes" ON note_attachments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete attachments of their own notes" ON note_attachments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- 9. Create RLS policies for note_tags
CREATE POLICY "Users can view their own tags" ON note_tags
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags" ON note_tags
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" ON note_tags
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" ON note_tags
    FOR DELETE USING (auth.uid() = user_id);

-- 10. Create RLS policies for note_views
CREATE POLICY "Users can view their own note views" ON note_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own note views" ON note_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Create function to get note with attachments
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

-- 14. Create function to search notes
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
    updated_at TIMESTAMP WITH TIME ZONE,
    attachment_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.user_id,
        n.title,
        n.content,
        n.content_type,
        n.attachments,
        n.tags,
        n.is_favorite,
        n.file_url,
        n.file_name,
        n.file_size,
        n.created_at,
        n.updated_at,
        COALESCE(att_count.count, 0) as attachment_count
    FROM notes n
    LEFT JOIN (
        SELECT note_id, COUNT(*) as count
        FROM note_attachments
        GROUP BY note_id
    ) att_count ON n.id = att_count.note_id
    WHERE n.user_id = auth.uid()
    AND (
        search_query = '' OR 
        n.title ILIKE '%' || search_query || '%' OR
        n.content ILIKE '%' || search_query || '%' OR
        EXISTS (
            SELECT 1 FROM unnest(n.tags) as tag 
            WHERE tag ILIKE '%' || search_query || '%'
        )
    )
    AND (
        array_length(tag_filter, 1) IS NULL OR
        n.tags && tag_filter
    )
    AND (
        content_type_filter = '' OR
        n.content_type = content_type_filter
    )
    AND (
        is_favorite_filter IS NULL OR
        n.is_favorite = is_favorite_filter
    )
    ORDER BY n.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
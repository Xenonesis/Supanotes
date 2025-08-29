# Quick Setup Guide - Enhanced Notes Features

## 🚀 Enable Enhanced Features in 3 Steps

### Step 1: Open Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Enhanced Schema
Copy and paste this SQL code into the SQL Editor and click **Run**:

```sql
-- Add new columns to existing notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create note_attachments table
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

-- Create note_tags table
CREATE TABLE IF NOT EXISTS note_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create note_views table
CREATE TABLE IF NOT EXISTS note_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id_updated_at ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_note_attachments_note_id ON note_attachments(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_user_id ON note_tags(user_id);

-- Enable RLS on new tables
ALTER TABLE note_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for note_attachments
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

CREATE POLICY "Users can delete attachments of their own notes" ON note_attachments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Create RLS policies for note_tags
CREATE POLICY "Users can view their own tags" ON note_tags
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags" ON note_tags
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" ON note_tags
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" ON note_tags
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for note_views
CREATE POLICY "Users can view their own note views" ON note_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own note views" ON note_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic timestamps
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create search function
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
        n.attachments,
        n.tags,
        n.is_favorite,
        n.file_url,
        n.file_name,
        n.file_size,
        n.created_at,
        n.updated_at
    FROM notes n
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
```

### Step 3: Refresh Your App
1. Refresh your notes app in the browser
2. The upgrade banner should disappear
3. You now have access to all enhanced features!

## 🎉 New Features Available

After setup, you'll have access to:

### ✨ **Mixed Content Notes**
- Add multiple images and audio files to a single note
- Combine text, images, and audio seamlessly
- Add captions to each attachment

### 🔍 **Advanced Search**
- Search across titles, content, and tags
- Filter by content type (text, image, audio, mixed)
- Filter by favorites
- Real-time search results

### 🏷️ **Tag System**
- Organize notes with custom tags
- Auto-suggestions for existing tags
- Filter notes by multiple tags

### ⭐ **Favorites**
- Mark important notes as favorites
- Quick filter to show only favorites
- Star system for easy identification

### 📊 **Enhanced UI**
- Statistics dashboard
- Grid and list view modes
- Full-screen preview modal
- Image zoom and audio playback controls

## 🔧 Troubleshooting

### If you get permission errors:
```sql
-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### If functions don't work:
```sql
-- Ensure you have function creation permissions
GRANT CREATE ON SCHEMA public TO postgres;
```

### Need to rollback?
The setup is backward compatible - your existing notes will continue to work even if you don't run the upgrade.

## 📞 Need Help?

- Check the browser console for any error messages
- Ensure you're running the SQL in the correct Supabase project
- Verify your Supabase credentials in the `.env` file
- All existing notes and data will be preserved during the upgrade

**Enjoy your enhanced notes experience! 🚀**
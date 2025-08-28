# Fix for "Could not find the 'content_type' column" Error

This error occurs when the Supabase database table is missing the `content_type` column or the schema cache is outdated.

## Quick Fix Steps:

### Option 1: Run the Fix SQL Script
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `fix_content_type_column.sql`
4. Run the script
5. Refresh your application

### Option 2: Manual Database Reset
If the above doesn't work, try a complete reset:

1. In Supabase SQL Editor, run:
```sql
-- Drop existing table completely
DROP TABLE IF EXISTS notes CASCADE;

-- Recreate with proper structure
CREATE TABLE notes (
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

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Add basic policies
CREATE POLICY "Users can manage their own notes" ON notes
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

### Option 3: Check Supabase Configuration
Make sure your environment variables are set correctly:

1. Check `.env` or `.env.local` file contains:
   - `VITE_SUPABASE_URL=your_supabase_url`
   - `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`

2. Restart your development server after updating environment variables

### Option 4: Clear Browser Cache
Sometimes the issue is with cached schema:
1. Clear your browser cache
2. Open browser dev tools → Application → Storage → Clear site data
3. Refresh the application

### Verify the Fix
After running the fix, you should see:
- No more "content_type column" errors
- Ability to create and view notes
- Proper authentication flow

If you're still having issues, check the browser console for additional error messages and ensure your Supabase project is properly configured with the correct URL and API key.

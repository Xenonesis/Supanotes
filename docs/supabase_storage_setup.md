# Supabase Storage Setup for Notes App

## Storage Bucket Configuration

### 1. Create Storage Bucket
In your Supabase dashboard, go to **Storage** and create a new bucket:

- **Bucket name**: `notes-media`
- **Public bucket**: ✅ Enable (so files can be accessed via public URLs)
- **File size limit**: 10MB (or adjust as needed)
- **Allowed MIME types**: Leave empty for all types, or specify:
  - Images: `image/jpeg,image/png,image/gif,image/webp`
  - Audio: `audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/webm`

### 2. Storage Policies
Run these policies in the Supabase SQL Editor to secure your storage:

```sql
-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'notes-media' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow authenticated users to view files in their own folder
CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'notes-media' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow authenticated users to delete files in their own folder
CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'notes-media' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

### 3. File Organization Structure
Files will be organized in the bucket as follows:
```
notes-media/
├── {user_id}/
│   ├── image/
│   │   ├── {uuid}.jpg
│   │   ├── {uuid}.png
│   │   └── ...
│   └── audio/
│       ├── {uuid}.mp3
│       ├── {uuid}.wav
│       └── ...
```

## Authentication Setup

### 1. Enable Authentication Providers
In your Supabase dashboard, go to **Authentication > Providers** and enable:

- **Email**: ✅ Enable (for magic link authentication)
- **Google**: ✅ Enable (optional, for OAuth)

### 2. Configure Email Templates (Optional)
Go to **Authentication > Email Templates** to customize:
- Magic Link email template
- Confirmation email template

### 3. Site URL Configuration
In **Authentication > URL Configuration**, set:
- **Site URL**: Your app's URL (e.g., `http://localhost:5173` for development)
- **Redirect URLs**: Add your app's URL to allowed redirect URLs

## Environment Variables
Make sure your `.env` file contains:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Setup
1. Run the database setup SQL commands
2. Create the storage bucket and policies
3. Start your app: `npm run dev`
4. Sign up/sign in with email
5. Try creating notes with text, images, and audio files
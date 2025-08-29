# Supabase Storage Bucket Setup Instructions

## How to Create the "notes-media" Bucket

The error you're seeing occurs because the required storage bucket has not been created in your Supabase project. Follow these steps to resolve this issue:

### Step 1: Access Your Supabase Dashboard
1. Go to https://app.supabase.com/
2. Sign in to your account
3. Select your project (or create a new one if needed)

### Step 2: Navigate to Storage
1. In the left sidebar, click on "Storage" under the "Services" section
2. You'll see a list of existing buckets (if any)

### Step 3: Create the "notes-media" Bucket
1. Click the "Create Bucket" button
2. In the "Bucket name" field, enter exactly: `notes-media`
3. Check the box for "Public bucket" (this is required for profile pictures to be accessible)
4. Click "Create Bucket"

### Step 4: Configure Bucket Settings (Optional but Recommended)
1. After creating the bucket, click on it to open its settings
2. Set appropriate file size limits:
   - Recommended: 10MB maximum file size
3. For allowed MIME types, you can leave it empty (allow all) or specify:
   - Images: `image/jpeg,image/png,image/gif,image/webp`
   - Audio: `audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/webm`

### Step 5: Apply Storage Policies
Run these SQL commands in your Supabase SQL Editor to secure your storage:

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

### Verification
After completing these steps:
1. Refresh your note-taking app
2. Try uploading a profile picture again
3. The error should no longer appear

## Troubleshooting

If you still encounter issues:

1. **Double-check the bucket name**: It must be exactly `notes-media` (case-sensitive)
2. **Verify the bucket is public**: The bucket must be public for profile pictures to work
3. **Check your Supabase credentials**: Ensure your `.env` file contains the correct:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Confirm you're using the correct project**: Make sure you're working with the right Supabase project

## Security Note

The policies we've created ensure that:
- Users can only upload files to their own folders
- Users can only view their own files
- Users can only delete their own files
- No user can access another user's files

This provides strong security while allowing the profile picture functionality to work correctly.

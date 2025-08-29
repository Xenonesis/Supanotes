# Profile Picture Setup Guide

## Overview
This guide explains how to set up profile picture functionality in the note-taking app. Users can upload, view, and remove their profile pictures.

## Implementation Details

### File Storage
Profile pictures are stored in the Supabase storage bucket `notes-media` under the path:
```
{user_id}/profile/avatar.{extension}
```

### Database Schema
Profile pictures are stored in the user metadata as `avatar_url`. The profile schema has been updated to include this field in both the user metadata examples and the separate profiles table option.

### File Upload Utility
The `uploadFile` function in `src/lib/fileUpload.ts` has been updated to support profile picture uploads with the following features:
- Special path handling for profile pictures
- File size limit of 2MB
- Support for JPEG, PNG, GIF, and WebP formats
- Automatic overwriting of existing profile pictures

### Profile Page Component
The `ProfilePage` component in `src/components/Dashboard/ProfilePage.tsx` includes:
- Profile picture display with fallback to default avatar
- Upload button with file input
- Remove button to delete profile picture
- Real-time preview of uploaded pictures
- Loading states during upload operations

## Setup Instructions

### 1. Supabase Storage Configuration
1. Create a storage bucket named `notes-media` in your Supabase project:
   - Go to your Supabase dashboard
   - Navigate to Storage → Create Bucket
   - Enter "notes-media" as the bucket name
   - Enable public access for the bucket
2. Set appropriate file size limits (recommended: 2MB for profile pictures)

### 2. Storage Policies
Ensure the following policies are in place for the `notes-media` bucket:

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

### 3. Profile Table Update
If you're using the separate profiles table option, add the avatar_url column to the existing profiles table:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### 4. Environment Variables
Ensure your `.env` file contains the Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### Uploading a Profile Picture
1. Navigate to the Profile page
2. Click the "Upload New" button in the Profile Picture section
3. Select an image file (JPEG, PNG, GIF, or WebP)
4. The picture will be automatically uploaded and displayed

### Removing a Profile Picture
1. Navigate to the Profile page
2. Click the "Remove" button next to the profile picture
3. The default avatar will be displayed instead

## Technical Details

### File Organization
Profile pictures are stored with a fixed filename to ensure easy replacement:
```
{user_id}/profile/avatar.{extension}
```

### Validation
- File size: Maximum 2MB
- File types: JPEG, PNG, GIF, WebP
- Automatic validation before upload

### Error Handling
- User-friendly error messages for invalid files
- Toast notifications for success and failure states
- Graceful handling of network errors

## Security Considerations

### Access Control
- Users can only access their own profile pictures
- All operations are authenticated
- File paths are user-specific to prevent unauthorized access

### Data Privacy
- Profile pictures are stored separately from note content
- URLs are stored in user metadata, not in public tables
- Users can remove their profile pictures at any time

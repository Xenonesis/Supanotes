# Notes App - Complete Setup Guide

This application allows users to save notes with text, audio, and images to a Supabase backend database.

## Features ✨

- **Text Notes**: Create and save text-based notes
- **Image Notes**: Upload and save images with optional captions
- **Audio Notes**: Upload and save audio files with optional descriptions
- **User Authentication**: Secure login with email magic links or Google OAuth
- **File Storage**: Secure file storage in Supabase Storage
- **Real-time Updates**: Notes are synced in real-time
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites 📋

1. **Node.js** (v16 or higher)
2. **Supabase Account** (free tier available)
3. **Git** (for cloning the repository)

## Quick Start 🚀

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd notes-app
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)

#### Database Setup
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `database_setup.sql`
3. Click **Run** to execute the SQL commands

#### Storage Setup
1. Go to **Storage** in your Supabase dashboard
2. Click **Create Bucket**
3. Name it `notes-media`
4. Enable **Public bucket**
5. Go to **SQL Editor** and run the storage policies from `supabase_storage_setup.md`

#### Authentication Setup
1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Optionally enable **Google** provider
4. Go to **Authentication > URL Configuration**
5. Add your app URL to **Site URL** and **Redirect URLs**

### 3. Environment Configuration
1. Copy your Supabase project URL and anon key from **Settings > API**
2. Update the `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Usage Guide 📱

### Creating Notes

#### Text Notes
1. Click the **Text** button in the note form
2. Type your note content
3. Click **Add Note**

#### Image Notes
1. Click the **Image** button in the note form
2. Select an image file (JPEG, PNG, GIF, WebP)
3. Add an optional caption
4. Click **Add Image Note**

#### Audio Notes
1. Click the **Audio** button in the note form
2. Select an audio file (MP3, WAV, OGG, MP4, WebM)
3. Add an optional description
4. Click **Add Audio Note**

### Managing Notes
- **View**: All notes are displayed in chronological order
- **Delete**: Click the trash icon on any note
- **Download**: Click the download icon on media notes

## File Specifications 📄

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP
- **Audio**: MP3, WAV, OGG, MP4, WebM

### File Size Limits
- Maximum file size: **10MB**
- Configurable in `src/lib/fileUpload.ts`

## Security Features 🔒

- **Row Level Security (RLS)**: Users can only access their own notes
- **File Access Control**: Users can only access their own uploaded files
- **Authentication Required**: All operations require user authentication
- **Input Validation**: File types and sizes are validated before upload

## Technology Stack 🛠️

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **File Upload**: Supabase Storage
- **Build Tool**: Vite
- **UI Components**: Custom components with Lucide React icons

## Project Structure 📁

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Main app components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
└── lib/               # Utility functions and Supabase client
```

## Troubleshooting 🔧

### Common Issues

1. **"Supabase not configured" error**
   - Check your `.env` file has correct Supabase credentials
   - Ensure environment variables start with `VITE_`

2. **File upload fails**
   - Verify the `notes-media` bucket exists and is public
   - Check storage policies are correctly applied
   - Ensure file size is under 10MB

3. **Authentication not working**
   - Verify email provider is enabled in Supabase
   - Check Site URL and Redirect URLs are configured
   - For Google OAuth, ensure client ID and secret are set

4. **Notes not loading**
   - Check database table `notes` exists
   - Verify RLS policies are applied
   - Ensure user is authenticated

### Development Tips
- Use browser dev tools to check network requests
- Check Supabase logs for detailed error messages
- Test with different file types and sizes
- Verify database schema matches the application code

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📝

This project is open source and available under the [MIT License](LICENSE).
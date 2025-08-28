# 📝 Supanotes - Advanced Note-Taking Web App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8-blue.svg)
![Supabase](https://img.shields.io/badge/supabase-2.56-blue.svg)

A modern, feature-rich note-taking application built with React, TypeScript, and Supabase. Create, organize, and manage notes with text, images, and audio files in a beautiful, responsive interface.

![Supanotes Dashboard](https://placehold.co/800x400/4F46E5/FFFFFF?text=Supanotes+Dashboard)

## 🌟 Features

### 📝 Core Features
- **Text Notes**: Create and edit rich text notes
- **Media Support**: Upload and manage images and audio files
- **Preview System**: Full-screen preview with zoom and playback controls
- **User Authentication**: Secure login with email/password or OAuth
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🚀 Enhanced Features (After Database Upgrade)
- **Mixed Content Notes**: Combine text, images, and audio in a single note
- **Advanced Search**: Filter by content type, tags, and favorites
- **Tagging System**: Organize notes with custom tags
- **Favorites**: Star important notes for quick access
- **Statistics Dashboard**: View insights about your notes collection
- **Advanced Preview**: Zoom images up to 300% and play audio files

### 🎨 UI/UX Highlights
- **Beautiful Interface**: Modern gradient backgrounds and card-based design
- **Multiple Views**: Switch between grid and list layouts
- **Dark/Light Mode**: Eye-friendly themes (coming soon)
- **Keyboard Shortcuts**: Efficient navigation and actions
- **Loading States**: Smooth animations and progress indicators

## 📸 Screenshots

### Dashboard View
![Dashboard](https://placehold.co/600x300/4F46E5/FFFFFF?text=Dashboard+View)

### Note Creation
![Note Creation](https://placehold.co/600x300/10B981/FFFFFF?text=Create+Notes)

### Preview Modal
![Preview](https://placehold.co/600x300/8B5CF6/FFFFFF?text=Preview+Modal)

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Build Tool**: Vite
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React Context API + Custom Hooks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Supabase Account (free tier available)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Xenonesis/Supanotes.git
cd Supanotes
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Set up the database**
   - Go to SQL Editor in your Supabase dashboard
   - Run the contents of `database_setup.sql`

6. **Set up storage**
   - Create a bucket named `notes-media` in Storage
   - Make it public
   - Run the storage policies from `supabase_storage_setup.md`

7. **Run the application**
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 🔧 Usage Guide

### Creating Notes

#### Text Notes
1. Click "Create New Note"
2. Select the "Text" tab
3. Enter your note content
4. Click "Add Note"

#### Image Notes
1. Click "Create New Note"
2. Select the "Image" tab
3. Choose an image file (JPEG, PNG, GIF, WebP)
4. Add an optional caption
5. Click "Add Image Note"

#### Audio Notes
1. Click "Create New Note"
2. Select the "Audio" tab
3. Choose an audio file (MP3, WAV, OGG, MP4, WebM)
4. Add an optional description
5. Click "Add Audio Note"

### Enhanced Features (After Database Upgrade)

#### Mixed Content Notes
1. Click "Create New Note"
2. Add a title (optional)
3. Write your text content
4. Click "Attach Files" to add multiple images/audio files
5. Add captions to each attachment
6. Add relevant tags
7. Mark as favorite if important

#### Advanced Search
- Use the search bar to find notes by content
- Filter by content type, tags, or favorites
- Combine multiple filters for precise results

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Main dashboard components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and Supabase client
└── App.tsx           # Main application component
```

## 🔄 Progressive Enhancement

This app uses a progressive enhancement approach:

1. **Basic Mode**: Works immediately with the basic database schema
2. **Enhanced Mode**: Unlocks advanced features after running the enhanced database setup

To enable enhanced features:
1. Download the setup guide from the upgrade banner in the app
2. Run the SQL commands in your Supabase SQL Editor
3. Refresh the app to access enhanced features

## 🔒 Security Features

- **Row Level Security**: Users can only access their own notes
- **File Access Control**: Protected file access with signed URLs
- **Input Validation**: File types and sizes are validated before upload
- **XSS Protection**: Sanitized content rendering

## 📱 Mobile Responsiveness

- **Touch-Friendly Interface**: Optimized for mobile devices
- **Responsive Grid**: Adapts to different screen sizes
- **Mobile-First Design**: Prioritizes mobile experience

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

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

### Troubleshooting

- Use browser dev tools to check network requests
- Check Supabase logs for detailed error messages
- Test with different file types and sizes
- Verify database schema matches the application code

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙌 Acknowledgements

- [Supabase](https://supabase.com) - Backend-as-a-Service
- [React](https://reactjs.org) - Frontend library
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Lucide React](https://lucide.dev) - Icon library
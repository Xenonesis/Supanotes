import React, { useState } from 'react'
import { Header } from './Header'
import { NoteForm } from './NoteForm'
import { NoteCard } from './NoteCard'
import { LoadingSpinner } from '../LoadingSpinner'
import { useNotes } from '../../hooks/useNotes'
import { Note } from '../../lib/supabase'
import { 
  Plus, Grid, List, Database, ExternalLink, AlertCircle
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

type ViewMode = 'grid' | 'list'

export const BasicDashboard: React.FC = () => {
  const { notes, loading, createNote, createMultimediaNote, deleteNote } = useNotes()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showForm, setShowForm] = useState(false)

  const handleNoteView = (noteId: string) => {
    // Basic view tracking - just log for now
    console.log('Viewing note:', noteId)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-8">
          {/* Upgrade Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Enhanced Features Available!
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    You're using the basic version. Upgrade your database to unlock:
                    <strong> Mixed content notes, Advanced search, Tags, Favorites, and more!</strong>
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const setupContent = `
# Quick Database Upgrade - Enable Enhanced Features

## Copy and run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Add enhanced columns to existing notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create note_attachments table for multiple files per note
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

-- Create note_tags table for tag management
CREATE TABLE IF NOT EXISTS note_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Enable RLS on new tables
ALTER TABLE note_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their note attachments" ON note_attachments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their tags" ON note_tags
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_note_attachments_note_id ON note_attachments(note_id);
\`\`\`

## After running the SQL:
1. Refresh your notes app
2. Enhanced features will be automatically available!
3. Enjoy mixed content notes, tags, favorites, and advanced search
                        `;
                        
                        const blob = new Blob([setupContent], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'supabase-upgrade-guide.md';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Download Setup Guide
                    </Button>
                    <span className="text-xs text-blue-600">
                      3-minute setup to enable all features
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Section */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Your Notes Workspace</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Notes</h2>
            <p className="text-gray-600 text-lg mb-6">
              Create and manage your notes with text, images, and audio
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
                  <div className="text-xs text-gray-600">Total Notes</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {notes.filter(note => note.content_type === 'text').length}
                  </div>
                  <div className="text-xs text-gray-600">Text</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {notes.filter(note => note.content_type === 'image').length}
                  </div>
                  <div className="text-xs text-gray-600">Images</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {notes.filter(note => note.content_type === 'audio').length}
                  </div>
                  <div className="text-xs text-gray-600">Audio</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Add Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-3"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              {showForm ? 'Cancel' : 'Create New Note'}
            </Button>
          </div>

          {/* Note Form */}
          {showForm && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Create New Note</span>
                </h3>
                <NoteForm onSubmit={createNote} onMultimediaSubmit={createMultimediaNote} />
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
            <div className="p-6">
              {/* Section Header with Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Your Notes</span>
                </h3>
                
                <div className="flex items-center space-x-2">
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none border-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none border-0 border-l border-gray-200"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notes Grid/List */}
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
                  <p className="text-gray-600 mb-4">
                    Start by creating your first note with text, images, or audio.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Note
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={deleteNote}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
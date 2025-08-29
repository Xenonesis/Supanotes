import React, { useState, useEffect } from 'react'
import { Header } from './Header'
import { LoadingSpinner } from '../LoadingSpinner'
import { useNotes } from '../../hooks/useNotes'
import { Note } from '../../lib/supabase'
import { EnhancedUpgradeBanner } from './EnhancedUpgradeBanner'
import { SearchControls } from './SearchControls'
import { NoteFormSection } from './NoteFormSection'
import { EmptyState } from './EmptyState'
import { NotesDisplay } from './NotesDisplay'

type ViewMode = 'grid' | 'list'
type SortMode = 'newest' | 'oldest' | 'title'

export const EnhancedBasicDashboard: React.FC = () => {
  const { notes, loading, createNote, createMultimediaNote, deleteNote } = useNotes()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  // Filter and sort notes
  useEffect(() => {
    const filtered = notes.filter(note => 
      (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredNotes(filtered)
  }, [notes, searchQuery, sortMode])


  const handleCreateNote = async (content: string) => {
    try {
      await createNote(content)
      setShowForm(false)
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleCreateMultimediaNote = async (content: string, contentType: 'text' | 'image' | 'audio' | 'mixed', file?: File) => {
    try {
      await createMultimediaNote(content, contentType, file)
      setShowForm(false)
    } catch (error) {
      console.error('Error creating multimedia note:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="gradient-bg-animated">
      <Header />
      
      <main className="max-w-7xl mx-auto mobile-padding py-8">
        <div className="space-y-8">
          {/* Enhanced Upgrade Banner */}
          <EnhancedUpgradeBanner />

          {/* Enhanced Controls Section */}
          <SearchControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortMode={sortMode}
            onSortChange={setSortMode}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCreateNote={() => setShowForm(!showForm)}
            totalNotes={filteredNotes.length}
          />

          {/* Note Form */}
          <NoteFormSection
            isVisible={showForm}
            onCreateNote={handleCreateNote}
            onCreateMultimediaNote={handleCreateMultimediaNote}
          />

          {/* Notes Grid/List */}
          {filteredNotes.length === 0 ? (
            <EmptyState
              hasSearchQuery={!!searchQuery}
              onCreateNote={() => setShowForm(true)}
            />
          ) : (
            <NotesDisplay
              notes={filteredNotes}
              viewMode={viewMode}
              onDeleteNote={deleteNote}
            />
          )}
        </div>
      </main>
    </div>
  )
}

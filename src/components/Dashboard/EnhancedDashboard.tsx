import React, { useState } from 'react'
import { Header } from './Header'
import { EnhancedNoteForm } from './EnhancedNoteForm'
import { NotesSearchFilter } from './NotesSearchFilter'
import { LoadingSpinner } from '../LoadingSpinner'
import { useCompatibleNotes } from '../../hooks/useCompatibleNotes'
import { Note } from '../../lib/supabase'
import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { UpgradeBanner } from './UpgradeBanner'
import { WelcomeSection } from './WelcomeSection'
import { NotesSection } from './NotesSection'


export const EnhancedDashboard: React.FC = () => {
  const {
    notes,
    loading,
    availableTags,
    searchFilters,
    isEnhancedMode,
    createNote,
    deleteNote,
    toggleFavorite,
    recordNoteView,
    setSearchFilters
  } = useCompatibleNotes()

  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleCreateNote = async (noteData: import('../../hooks/useCompatibleNotes').CreateNoteData) => {
    await createNote(noteData)
    setShowForm(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleNoteView = (noteId: string) => {
    recordNoteView(noteId)
  }

  const getStats = () => {
    const totalNotes = notes.length
    const favoriteNotes = notes.filter(note => note.is_favorite).length
    const textNotes = notes.filter(note => note.content_type === 'text').length
    const imageNotes = notes.filter(note => note.content_type === 'image').length
    const audioNotes = notes.filter(note => note.content_type === 'audio').length
    const mixedNotes = notes.filter(note => note.content_type === 'mixed').length
    
    return {
      totalNotes,
      favoriteNotes,
      textNotes,
      imageNotes,
      audioNotes,
      mixedNotes
    }
  }

  const stats = getStats()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-8">
          {/* Upgrade Banner */}
          <UpgradeBanner isEnhancedMode={isEnhancedMode} />
          
          {/* Welcome Section with Stats */}
          <WelcomeSection stats={stats} />

          {/* Search and Filters */}

          {/* Search and Filters */}
          <NotesSearchFilter
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            availableTags={availableTags}
            totalNotes={notes.length}
          />

          {/* Quick Add Button */}
          <div className="flex justify-center animate-fade-in-up stagger-3">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3 interactive-glow"
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
                  <span>{editingNote ? 'Edit Note' : 'Create New Note'}</span>
                </h3>
                <EnhancedNoteForm
                  onSubmit={handleCreateNote}
                  availableTags={availableTags}
                />
              </div>
            </div>
          )}

          {/* Notes Section */}
          <NotesSection
            notes={notes}
            onDelete={deleteNote}
            onToggleFavorite={toggleFavorite}
            onView={handleNoteView}
            onEdit={handleEditNote}
            setShowForm={setShowForm}
          />
        </div>
      </main>
    </div>
  )
}

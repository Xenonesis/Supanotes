import React, { useState } from 'react'
import { Header } from './Header'
import { NoteForm } from './NoteForm'
import { EnhancedNotesList } from './EnhancedNotesList'
import { EditNoteModal } from './EditNoteModal'
import { SettingsModal } from './SettingsModal'
import { LayoutSelector } from './LayoutSelector'
import { useNotes } from '../../hooks/useNotes'
import { useLayoutPreferences } from '../../hooks/useLayoutPreferences'
import { Note } from '../../lib/supabase'
import { Settings, Plus } from 'lucide-react'
import { Button } from '../ui/Button'

export const Dashboard: React.FC = () => {
  const { notes, loading, createNote, createMultimediaNote, deleteNote, toggleFavorite, updateNote } = useNotes()
  const { layout } = useLayoutPreferences()
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (noteId: string, updates: Partial<Note>) => {
    await updateNote(noteId, updates)
    setShowEditModal(false)
    setEditingNote(null)
  }

  const handleCloseEdit = () => {
    setShowEditModal(false)
    setEditingNote(null)
  }

  const handleImportNotes = async (importedNotes: Note[]) => {
    for (const note of importedNotes) {
      // Remove the id to create new notes
      const { id, ...noteData } = note
      await createNote(noteData.content || '')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Your Personal Workspace</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Notes</h2>
            <p className="text-gray-600 text-lg">Create, organize, and manage your thoughts with text, images, and audio</p>
          </div>
          
          {/* Quick Add Note */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Quick Add</span>
              </h3>
              <NoteForm onSubmit={createNote} onMultimediaSubmit={createMultimediaNote} />
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Recent Notes</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <LayoutSelector />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="h-8 px-3"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                  <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                  </div>
                </div>
              </div>
              <EnhancedNotesList
                notes={notes}
                loading={loading}
                onDelete={deleteNote}
                onToggleFavorite={toggleFavorite}
                onEdit={handleEditNote}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <EditNoteModal
        note={editingNote}
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        notes={notes}
        onImport={handleImportNotes}
      />
    </div>
  )
}

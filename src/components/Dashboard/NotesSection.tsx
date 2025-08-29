import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { EnhancedNoteCard } from './EnhancedNoteCard'
import { Note } from '../../lib/supabase'
import { 
  Grid, List, BarChart3, Plus
} from 'lucide-react'

type ViewMode = 'grid' | 'list'
type SortMode = 'newest' | 'oldest' | 'alphabetical' | 'favorites'

interface NotesSectionProps {
  notes: Note[]
  onDelete: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
  onView: (noteId: string) => void
  onEdit: (note: Note) => void
  setShowForm: (show: boolean) => void
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onDelete,
  onToggleFavorite,
  onView,
  onEdit,
  setShowForm
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const getSortedNotes = () => {
    const sortedNotes = [...notes]
    
    switch (sortMode) {
      case 'oldest':
        return sortedNotes.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      case 'alphabetical':
        return sortedNotes.sort((a, b) => {
          const titleA = a.title || a.content || ''
          const titleB = b.title || b.content || ''
          return titleA.localeCompare(titleB)
        })
      case 'favorites':
        return sortedNotes.sort((a, b) => {
          if (a.is_favorite && !b.is_favorite) return -1
          if (!a.is_favorite && b.is_favorite) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      case 'newest':
      default:
        return sortedNotes.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  }

  const sortedNotes = getSortedNotes()

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm animate-fade-in-up stagger-4">
      <div className="p-6">
        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span>Your Notes</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            {/* Sort Controls */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-soft"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="favorites">Favorites First</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-soft">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none border-0 interactive-glow"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none border-0 border-l border-gray-200 interactive-glow"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Grid/List */}
        {sortedNotes.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-gray-40 mb-4">
              <BarChart3 className="h-12 w-12 mx-auto animate-bounce-gentle" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No notes found</h4>
            <p className="text-gray-600 mb-4">
              {Object.keys({}).length > 0
                ? 'Try adjusting your search filters or create a new note.'
                : 'Start by creating your first note with text, images, or audio.'}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="interactive-glow"
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
            {sortedNotes.map((note, index) => (
              <div key={note.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <EnhancedNoteCard
                  note={note}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                  onView={onView}
                  onEdit={onEdit}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

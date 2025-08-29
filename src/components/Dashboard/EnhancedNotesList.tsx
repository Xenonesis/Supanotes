import React from 'react'
import { Note } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'
import { NoteCard } from './NoteCard'
import { EnhancedNoteCard } from './EnhancedNoteCard'

interface EnhancedNotesListProps {
  notes: Note[]
  loading: boolean
  onDelete: (noteId: string) => void
  onToggleFavorite?: (noteId: string) => void
  onEdit?: (note: Note) => void
}

export const EnhancedNotesList: React.FC<EnhancedNotesListProps> = ({
  notes,
  loading,
  onDelete,
  onToggleFavorite,
  onEdit
}) => {
  const { layout } = useTheme()

  if (loading) {
    return (
      <div className={getLoadingLayoutClass(layout)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-sm mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No notes yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Create your first note to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={getLayoutClass(layout)}>
      {notes.map((note) => (
        <EnhancedNoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          layout={layout}
        />
      ))}
    </div>
  )
}

const getLayoutClass = (layout: string) => {
  switch (layout) {
    case 'list':
      return 'space-y-4'
    case 'masonry':
      return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'
    case 'compact':
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3'
    case 'grid':
    default:
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
  }
}

const getLoadingLayoutClass = (layout: string) => {
  switch (layout) {
    case 'list':
      return 'space-y-4'
    case 'masonry':
      return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'
    case 'compact':
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3'
    case 'grid':
    default:
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
  }
}
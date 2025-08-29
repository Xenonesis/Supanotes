import React from 'react'
import { NoteCard } from './NoteCard'
import { Note } from '../../lib/supabase'

type ViewMode = 'grid' | 'list'

interface NotesDisplayProps {
  notes: Note[]
  viewMode: ViewMode
  onDeleteNote: (noteId: string) => void
}

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  notes,
  viewMode,
  onDeleteNote
}) => {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {notes.map((note, index) => (
          <div
            key={note.id}
            className="animate-fade-in-up interactive-lift"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <NoteCard
              note={note}
              onDelete={() => onDeleteNote(note.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
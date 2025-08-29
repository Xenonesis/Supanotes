import React from 'react'
import { NoteForm } from './NoteForm'
import { Card, CardContent } from '../ui/Card'

interface NoteFormSectionProps {
  isVisible: boolean
  onCreateNote: (content: string) => Promise<void>
  onCreateMultimediaNote: (content: string, contentType: 'text' | 'image' | 'audio' | 'mixed', file?: File) => Promise<void>
}

export const NoteFormSection: React.FC<NoteFormSectionProps> = ({
  isVisible,
  onCreateNote,
  onCreateMultimediaNote
}) => {
  if (!isVisible) {
    return null
  }

  return (
    <div className="animate-fade-in-up">
      <Card className="glass-strong">
        <CardContent className="p-6">
          <NoteForm
            onSubmit={onCreateNote}
            onMultimediaSubmit={onCreateMultimediaNote}
          />
        </CardContent>
      </Card>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { X, Save, FileText, Image, Mic } from 'lucide-react'
import { Note } from '../../lib/supabase'

interface EditNoteModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
  onSave: (noteId: string, updates: Partial<Note>) => void
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave
}) => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && note) {
      setContent(note.content || '')
      setTitle(note.title || '')
    }
  }, [isOpen, note])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !note) return null

  const handleSave = async () => {
    if (!note) return

    try {
      setLoading(true)
      const updates: Partial<Note> = {}
      
      if (content !== note.content) {
        updates.content = content
      }
      
      if (title !== note.title) {
        updates.title = title
      }

      if (Object.keys(updates).length > 0) {
        await onSave(note.id, updates)
      }
      
      onClose()
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false)
    }
  }

  const getContentTypeIcon = () => {
    switch (note.content_type) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
      case 'audio':
        return <Mic className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const hasChanges = content !== (note.content || '') || title !== (note.title || '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            {getContentTypeIcon()}
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Note
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || loading}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your note..."
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              disabled={loading}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* File Preview (if applicable) */}
          {note.file_url && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Attached File
              </label>
              <div className="border rounded-lg p-4 bg-gray-50">
                {note.content_type === 'image' && (
                  <img
                    src={note.file_url}
                    alt="Note attachment"
                    className="max-w-full max-h-48 rounded border border-gray-200"
                  />
                )}
                
                {note.content_type === 'audio' && (
                  <audio controls className="w-full">
                    <source src={note.file_url} />
                    Your browser does not support the audio element.
                  </audio>
                )}
                
                <p className="text-sm text-gray-600 mt-2">
                  Note: File attachments cannot be edited. You can only modify the text content.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {hasChanges ? 'You have unsaved changes' : 'No changes made'}
            </span>
            <span className="capitalize">
              {note.content_type} Note
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
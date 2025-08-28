import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Trash2, Clock, Image, Mic, FileText, Download } from 'lucide-react'
import { Note } from '../../lib/supabase'

interface NoteCardProps {
  note: Note
  onDelete: (noteId: string) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getContentTypeIcon = () => {
    switch (note.content_type) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />
      case 'audio':
        return <Mic className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleDownload = () => {
    if (note.file_url) {
      window.open(note.file_url, '_blank')
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Header with content type and actions */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              {getContentTypeIcon()}
              <span className="text-xs font-medium text-gray-600 capitalize">
                {note.content_type} Note
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {note.file_url && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
              <Button
                onClick={() => onDelete(note.id)}
                variant="danger"
                size="sm"
                className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content based on type */}
          <div className="space-y-3">
            {/* Image content */}
            {note.content_type === 'image' && note.file_url && (
              <div className="relative">
                <img
                  src={note.file_url}
                  alt="Note image"
                  className="max-w-full h-auto rounded-lg border border-gray-200 cursor-pointer"
                  onClick={handleDownload}
                />
              </div>
            )}

            {/* Audio content */}
            {note.content_type === 'audio' && note.file_url && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <audio controls className="w-full">
                  <source src={note.file_url} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Text content */}
            {note.content && (
              <p className="text-gray-900 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {note.content}
              </p>
            )}
          </div>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(note.created_at)}</span>
            </div>
            {note.file_size && (
              <span className="text-gray-400">
                {formatFileSize(note.file_size)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

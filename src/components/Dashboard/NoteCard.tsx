import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Trash2, Clock, Image, Mic, FileText, Download, Eye, Star } from 'lucide-react'
import { Note } from '../../lib/supabase'
import { formatDate, formatFileSize } from '../../lib/utils'

interface NoteCardProps {
  note: Note
  onDelete: (noteId: string) => void
  onToggleFavorite?: (noteId: string) => void
  onEdit?: (note: Note) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onToggleFavorite, onEdit: _onEdit }) => {
  // onEdit is unused but kept for interface compatibility
  void _onEdit
  const openPreviewInNewPage = () => {
    const previewUrl = `/preview?id=${note.id}`
    window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
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
              <Button
                onClick={openPreviewInNewPage}
                variant="outline"
                size="sm"
                className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
                title="Preview & Edit"
              >
                <Eye className="h-3 w-3" />
              </Button>
              {note.file_url && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
                  title="Download"
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
              {onToggleFavorite && (
                <Button
                  onClick={() => onToggleFavorite(note.id)}
                  variant="outline"
                  size="sm"
                  className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
                  title={note.is_favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={`h-3 w-3 ${note.is_favorite ? 'fill-current text-yellow-500' : ''}`} />
                </Button>
              )}
              <Button
                onClick={() => onDelete(note.id)}
                variant="danger"
                size="sm"
                className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
                title="Delete"
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
              <div className={`text-gray-900 whitespace-pre-wrap break-words text-sm leading-relaxed ${
                note.content.trim().length < 10 ? 'p-3 bg-gray-50 border border-gray-200 rounded text-center italic' : ''
              }`}>
                {note.content.trim().length < 10 ? (
                  <span>"{note.content}"</span>
                ) : (
                  note.content
                )}
              </div>
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

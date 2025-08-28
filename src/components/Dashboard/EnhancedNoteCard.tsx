import React, { useState } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
  Trash2, Clock, Image, Mic, FileText, Download, Star, 
  Eye, EyeOff, Edit, Hash, Paperclip, ChevronDown, ChevronUp,
  Play, Pause, Volume2
} from 'lucide-react'
import { Note, NoteAttachment } from '../../lib/supabase'

interface EnhancedNoteCardProps {
  note: Note
  onDelete: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
  onView: (noteId: string) => void
  onEdit?: (note: Note) => void
}

export const EnhancedNoteCard: React.FC<EnhancedNoteCardProps> = ({ 
  note, 
  onDelete, 
  onToggleFavorite, 
  onView,
  onEdit 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

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
      case 'mixed':
        return <Paperclip className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleDownload = (url: string, fileName?: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = () => {
    setShowFullPreview(!showFullPreview)
    if (!showFullPreview) {
      onView(note.id)
    }
  }

  const toggleAudioPlayback = (audioUrl: string, audioId: string) => {
    const audio = document.getElementById(audioId) as HTMLAudioElement
    if (!audio) return

    if (playingAudio === audioId) {
      audio.pause()
      setPlayingAudio(null)
    } else {
      // Pause any other playing audio
      if (playingAudio) {
        const currentAudio = document.getElementById(playingAudio) as HTMLAudioElement
        currentAudio?.pause()
      }
      audio.play()
      setPlayingAudio(audioId)
    }
  }

  const handleAudioEnded = () => {
    setPlayingAudio(null)
  }

  const getTotalAttachments = () => {
    const attachmentCount = note.attachments?.length || 0
    const legacyFile = note.file_url ? 1 : 0
    return attachmentCount + legacyFile
  }

  const renderAttachment = (attachment: NoteAttachment, index: number) => {
    const audioId = `audio-${note.id}-${index}`
    
    return (
      <div key={attachment.id} className="border rounded-lg p-3 bg-gray-50">
        {attachment.type === 'image' && (
          <div className="space-y-2">
            <img
              src={attachment.url}
              alt="Note attachment"
              className={`max-w-full rounded cursor-pointer transition-all ${
                showFullPreview ? 'max-h-none' : 'max-h-48'
              }`}
              onClick={() => handleDownload(attachment.url, attachment.fileName)}
            />
            {attachment.caption && (
              <p className="text-sm text-gray-600 italic">{attachment.caption}</p>
            )}
          </div>
        )}
        
        {attachment.type === 'audio' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAudioPlayback(attachment.url, audioId)}
                className="flex-shrink-0"
              >
                {playingAudio === audioId ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.fileName.split('/').pop()}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(attachment.url, attachment.fileName)}
                className="flex-shrink-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <audio
              id={audioId}
              src={attachment.url}
              onEnded={handleAudioEnded}
              className="w-full"
              controls={showFullPreview}
              style={{ display: showFullPreview ? 'block' : 'none' }}
            />
            
            {attachment.caption && (
              <p className="text-sm text-gray-600 italic">{attachment.caption}</p>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderLegacyContent = () => {
    if (!note.file_url) return null

    return (
      <div className="border rounded-lg p-3 bg-gray-50">
        {note.content_type === 'image' && (
          <img
            src={note.file_url}
            alt="Note image"
            className={`max-w-full rounded cursor-pointer transition-all ${
              showFullPreview ? 'max-h-none' : 'max-h-48'
            }`}
            onClick={() => handleDownload(note.file_url!, note.file_name)}
          />
        )}
        
        {note.content_type === 'audio' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 flex-1">
                {note.file_name?.split('/').pop() || 'Audio file'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(note.file_url!, note.file_name)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <audio controls className="w-full">
              <source src={note.file_url} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    )
  }

  const shouldShowExpandButton = () => {
    const hasLongContent = note.content && note.content.length > 200
    const hasMultipleAttachments = getTotalAttachments() > 1
    return hasLongContent || hasMultipleAttachments
  }

  const getPreviewContent = () => {
    if (!note.content) return ''
    return isExpanded ? note.content : note.content.slice(0, 200) + (note.content.length > 200 ? '...' : '')
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Header with title, content type and actions */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              {note.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {note.title}
                </h3>
              )}
              <div className="flex items-center space-x-2">
                {getContentTypeIcon()}
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {note.content_type} Note
                </span>
                {getTotalAttachments() > 0 && (
                  <span className="text-xs text-gray-500">
                    • {getTotalAttachments()} attachment{getTotalAttachments() > 1 ? 's' : ''}
                  </span>
                )}
                {note.is_favorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
                className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
              >
                {showFullPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              
              {onEdit && (
                <Button
                  onClick={() => onEdit(note)}
                  variant="outline"
                  size="sm"
                  className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              
              <Button
                onClick={() => onToggleFavorite(note.id)}
                variant="outline"
                size="sm"
                className="opacity-70 hover:opacity-100 transition-opacity p-1 h-7 w-7"
              >
                <Star className={`h-3 w-3 ${note.is_favorite ? 'fill-current text-yellow-500' : ''}`} />
              </Button>
              
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

          {/* Content */}
          <div className="space-y-3">
            {/* Text content */}
            {note.content && (
              <div className="space-y-2">
                <p className="text-gray-900 whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {getPreviewContent()}
                </p>
                
                {shouldShowExpandButton() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show More
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Attachments */}
            {note.attachments && note.attachments.length > 0 && (
              <div className="space-y-2">
                {(showFullPreview || isExpanded ? note.attachments : note.attachments.slice(0, 2)).map((attachment, index) => 
                  renderAttachment(attachment, index)
                )}
                
                {!showFullPreview && !isExpanded && note.attachments.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="text-xs w-full"
                  >
                    Show {note.attachments.length - 2} more attachment{note.attachments.length - 2 > 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            )}

            {/* Legacy content support */}
            {renderLegacyContent()}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(note.created_at)}</span>
              {note.updated_at && note.updated_at !== note.created_at && (
                <span className="text-gray-400">• edited</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {(note.file_size || (note.attachments && note.attachments.length > 0)) && (
                <span className="text-gray-400">
                  {note.file_size ? formatFileSize(note.file_size) : 
                   note.attachments?.reduce((total, att) => total + att.fileSize, 0) ? 
                   formatFileSize(note.attachments.reduce((total, att) => total + att.fileSize, 0)) : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
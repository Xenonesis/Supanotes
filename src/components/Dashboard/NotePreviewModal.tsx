import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
  X, Download, Star, Edit, Trash2, Share, Copy, 
  ZoomIn, ZoomOut, RotateCw, Play, Pause, Volume2,
  Hash, Clock, FileText, Image, Mic, Paperclip,
  ChevronLeft, ChevronRight, Maximize, Minimize
} from 'lucide-react'
import { Note, NoteAttachment } from '../../lib/supabase'

const convertMarkdownToHtml = (markdown: string) => {
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    .replace(/__(.*?)__/gim, '<u class="underline">$1</u>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n/gim, '<br>')
}

interface NotePreviewModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
  onDelete: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
  onEdit?: (note: Note) => void
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({
  note,
  isOpen,
  onClose,
  onDelete,
  onToggleFavorite,
  onEdit
}) => {
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setCurrentAttachmentIndex(0)
      setImageZoom(100)
      setIsFullscreen(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
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
        return <Image className="h-5 w-5 text-blue-500" />
      case 'audio':
        return <Mic className="h-5 w-5 text-green-500" />
      case 'mixed':
        return <Paperclip className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
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

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(note.content || '')
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title || 'Shared Note',
          text: note.content || '',
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copying to clipboard
      handleCopyContent()
    }
  }

  const toggleAudioPlayback = (audioUrl: string, audioId: string) => {
    const audio = document.getElementById(audioId) as HTMLAudioElement
    if (!audio) return

    if (playingAudio === audioId) {
      audio.pause()
      setPlayingAudio(null)
    } else {
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

  const getAllAttachments = () => {
    const attachments = note.attachments || []
    
    // Add legacy file support
    if (note.file_url && note.content_type !== 'text') {
      const legacyAttachment: NoteAttachment = {
        id: 'legacy',
        type: note.content_type === 'image' ? 'image' : 'audio',
        url: note.file_url,
        fileName: note.file_name || 'file',
        fileSize: note.file_size || 0
      }
      return [legacyAttachment, ...attachments]
    }
    
    return attachments
  }

  const allAttachments = getAllAttachments()
  const currentAttachment = allAttachments[currentAttachmentIndex]

  const nextAttachment = () => {
    setCurrentAttachmentIndex((prev) => 
      prev < allAttachments.length - 1 ? prev + 1 : 0
    )
    setImageZoom(100)
  }

  const prevAttachment = () => {
    setCurrentAttachmentIndex((prev) => 
      prev > 0 ? prev - 1 : allAttachments.length - 1
    )
    setImageZoom(100)
  }

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev + 25, 300))
  }

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev - 25, 25))
  }

  const resetZoom = () => {
    setImageZoom(100)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl mx-4'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getContentTypeIcon()}
            <div className="min-w-0 flex-1">
              {note.title && (
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {note.title}
                </h2>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatDate(note.created_at)}</span>
                {note.is_favorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyContent}
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFavorite(note.id)}
            >
              <Star className={`h-4 w-4 ${note.is_favorite ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(note)
                  onClose()
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(note.id)
                onClose()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: isFullscreen ? 'calc(100vh - 140px)' : '70vh' }}>
          <div className="p-6 space-y-6">
            {/* Text Content */}
            {note.content && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div 
                  className="text-gray-900 dark:text-gray-100 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: convertMarkdownToHtml(note.content) 
                  }}
                />
              </div>
            )}

            {/* Attachments */}
            {allAttachments.length > 0 && (
              <div className="space-y-4">
                {/* Attachment Navigation */}
                {allAttachments.length > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Attachment {currentAttachmentIndex + 1} of {allAttachments.length}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={prevAttachment}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextAttachment}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Current Attachment */}
                {currentAttachment && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {currentAttachment.type === 'image' && (
                      <div className="space-y-4">
                        {/* Image Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={zoomOut}>
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-600">{imageZoom}%</span>
                            <Button variant="outline" size="sm" onClick={zoomIn}>
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={resetZoom}>
                              Reset
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(currentAttachment.url, currentAttachment.fileName)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        
                        {/* Image */}
                        <div className="flex justify-center overflow-auto">
                          <img
                            src={currentAttachment.url}
                            alt="Note attachment"
                            style={{ 
                              transform: `scale(${imageZoom / 100})`,
                              transformOrigin: 'center',
                              maxWidth: 'none'
                            }}
                            className="rounded border border-gray-200"
                          />
                        </div>
                      </div>
                    )}

                    {currentAttachment.type === 'audio' && (
                      <div className="space-y-4">
                        {/* Audio Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAudioPlayback(
                                currentAttachment.url, 
                                `preview-audio-${currentAttachmentIndex}`
                              )}
                            >
                              {playingAudio === `preview-audio-${currentAttachmentIndex}` ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Volume2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {currentAttachment.fileName.split('/').pop()}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(currentAttachment.url, currentAttachment.fileName)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        
                        {/* Audio Player */}
                        <audio
                          id={`preview-audio-${currentAttachmentIndex}`}
                          src={currentAttachment.url}
                          onEnded={handleAudioEnded}
                          controls
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Attachment Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Size: {formatFileSize(currentAttachment.fileSize)}</span>
                        {currentAttachment.caption && (
                          <span className="italic">"{currentAttachment.caption}"</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Created: {formatDate(note.created_at)}</span>
              {note.updated_at && note.updated_at !== note.created_at && (
                <span>• Last edited: {formatDate(note.updated_at)}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="capitalize">{note.content_type} Note</span>
              {allAttachments.length > 0 && (
                <span>• {allAttachments.length} attachment{allAttachments.length > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
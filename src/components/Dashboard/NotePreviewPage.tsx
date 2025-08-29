import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent } from '../ui/Card'
import { RichTextEditor } from '../ui/RichTextEditor'
import { 
  ArrowLeft, Download, Star, Share, Copy, Edit, Save, X,
  ZoomIn, ZoomOut, Play, Pause, Volume2,
  Hash, Clock, FileText, Image, Mic, Paperclip,
  ChevronLeft, ChevronRight, Tag, ExternalLink,
  Grid, List, Search, Filter, SortAsc, SortDesc,
  Plus, AlertCircle, Database, Eye, Upload, Type
} from 'lucide-react'
import { Note, NoteAttachment } from '../../lib/supabase'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

export const NotePreviewPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const noteId = searchParams.get('id')
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(100)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editingContent, setEditingContent] = useState('')
  const [editingTitle, setEditingTitle] = useState('')
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Enhanced features state
  const [showEnhancedFeatures, setShowEnhancedFeatures] = useState(false)
  const [isEnhancedMode, setIsEnhancedMode] = useState(false)
  const [useRichText, setUseRichText] = useState(false)

  const fetchNote = useCallback(async () => {
    if (!noteId) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single()

      if (error) throw error

      setNote(data)
      
      // Check if this is enhanced mode by looking for enhanced columns
      const hasEnhancedColumns = data.tags !== undefined || data.is_favorite !== undefined
      setIsEnhancedMode(hasEnhancedColumns)
      
    } catch (err) {
      console.error('Error fetching note:', err)
      setError('Failed to load note')
    } finally {
      setLoading(false)
    }
  }, [noteId])

  useEffect(() => {
    if (noteId) {
      fetchNote()
    } else {
      setError('No note ID provided')
      setLoading(false)
    }
  }, [noteId, fetchNote])

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
    if (!note) return null
    switch (note.content_type) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />
      case 'audio':
        return <Mic className="h-6 w-6 text-green-500" />
      case 'mixed':
        return <Paperclip className="h-6 w-6 text-purple-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
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
    if (!note?.content) return
    try {
      await navigator.clipboard.writeText(note.content)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }

  const handleShare = async () => {
    if (!note) return
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

  const toggleAudioPlayback = (_audioUrl: string, audioId: string) => {
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

  const getAllAttachments = (): NoteAttachment[] => {
    if (!note) return []
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

  const enterEditMode = useCallback(() => {
    if (!note) return
    setIsEditing(true)
    setEditingContent(note.content || '')
    setEditingTitle(note.title || '')
    setEditingTags(note.tags || [])
  }, [note])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditingContent('')
    setEditingTitle('')
    setEditingTags([])
    setNewTag('')
  }, [])

  const saveEdit = useCallback(async () => {
    if (!note) return
    
    try {
      setSaving(true)
      
      const updates: Partial<Note> = {}
      if (editingContent !== note.content) {
        updates.content = editingContent
      }
      if (editingTitle !== note.title) {
        updates.title = editingTitle
      }
      if (isEnhancedMode && JSON.stringify(editingTags) !== JSON.stringify(note.tags)) {
        updates.tags = editingTags.length > 0 ? editingTags : null
      }
      
      if (Object.keys(updates).length === 0) {
        setIsEditing(false)
        return
      }

      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', note.id)

      if (error) throw error

      // Update local note state
      setNote({ ...note, ...updates })
      setIsEditing(false)
      
      // Show success message
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
    } catch (err) {
      console.error('Error saving note:', err)
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }, [note, editingContent, editingTitle, editingTags, isEnhancedMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) {
        if (e.key === 'Escape') {
          e.preventDefault()
          cancelEdit()
        } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          saveEdit()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, cancelEdit, saveEdit])

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.close()
    }
  }

  // Tag management functions
  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !editingTags.includes(trimmedTag)) {
      setEditingTags(prev => [...prev, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditingTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  // Toggle favorite functionality
  const toggleFavorite = async () => {
    if (!note || !isEnhancedMode) return
    
    try {
      const newFavoriteStatus = !note.is_favorite
      
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: newFavoriteStatus })
        .eq('id', note.id)

      if (error) throw error

      setNote({ ...note, is_favorite: newFavoriteStatus })
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setError('Failed to update favorite status')
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading note...</p>
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md border`}>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Note Not Found</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{error || 'The note you are looking for does not exist.'}</p>
            <Button onClick={goBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={goBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                {getContentTypeIcon()}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      placeholder="Note title (optional)"
                      disabled={saving}
                      className={`text-xl font-semibold ${isDark ? 'text-gray-100 bg-gray-800 border-gray-600' : 'text-gray-900 bg-white border-gray-300'} focus:border-blue-500`}
                    />
                  ) : (
                    note.title && (
                      <h1 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                        {note.title}
                      </h1>
                    )
                  )}
                  <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(note.created_at)}</span>
                    {isEnhancedMode && note.is_favorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {isEnhancedMode && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Enhanced
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  {isEnhancedMode && (
                    <Button
                      variant={note.is_favorite ? "primary" : "outline"}
                      size="sm"
                      onClick={toggleFavorite}
                      title={note.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`h-4 w-4 ${note.is_favorite ? 'fill-current' : ''}`} />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={enterEditMode}
                    title="Edit note"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    title="Share"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyContent}
                    title="Copy content"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  {useRichText && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <Type className="h-3 w-3 mr-1" />
                      Rich Text
                    </span>
                  )}
                  
                  <Button
                    onClick={saveEdit}
                    disabled={saving}
                    loading={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                    title="Save changes"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={saving}
                    title="Cancel editing"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="px-4 sm:px-6 lg:px-8 pb-2">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                Press <kbd className={`px-2 py-1 text-xs font-semibold ${isDark ? 'text-gray-200 bg-gray-700 border-gray-600' : 'text-gray-800 bg-gray-100 border-gray-200'} border rounded`}>Ctrl+S</kbd> to save or <kbd className={`px-2 py-1 text-xs font-semibold ${isDark ? 'text-gray-200 bg-gray-700 border-gray-600' : 'text-gray-800 bg-gray-100 border-gray-200'} border rounded`}>Esc</kbd> to cancel
                {useRichText && <span className="ml-2">• Rich text formatting available</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Features Banner */}
        {!isEnhancedMode && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Enhanced Features Available!
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mt-2">
                    You're viewing in basic mode. Upgrade your database to unlock:
                    <strong className="block sm:inline sm:ml-1">
                      Tags, Favorites, Mixed content notes, Advanced search, and more!
                    </strong>
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    icon={<ExternalLink />}
                    onClick={() => window.open('/ENHANCED_FEATURES_GUIDE.md', '_blank')}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Success Message */}
        {saveSuccess && (
          <div className={`mb-4 p-4 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                  Note saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="p-8 space-y-8">
            {/* Text Content */}
            {(note.content || isEditing) && (
              <div className="prose max-w-none">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Content
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUseRichText(!useRichText)}
                        disabled={saving}
                        className="flex items-center space-x-2"
                      >
                        <Type className="h-4 w-4" />
                        <span>{useRichText ? 'Plain Text' : 'Rich Text'}</span>
                      </Button>
                    </div>
                    
                    {useRichText ? (
                      <RichTextEditor
                        value={editingContent}
                        onChange={setEditingContent}
                        placeholder="Write your note content here..."
                        disabled={saving}
                        className={isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}
                      />
                    ) : (
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        placeholder="Write your note content here..."
                        disabled={saving}
                        rows={12}
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y leading-relaxed ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    )}
                    
                    {/* Enhanced Tags Editing */}
                    {isEnhancedMode && (
                      <div className="space-y-3">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <Tag className="h-4 w-4 mr-1" />
                          Tags
                        </label>
                        
                        {/* Add new tag */}
                        <div className="flex space-x-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="flex-1"
                            size="sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTag}
                            disabled={!newTag.trim() || saving}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Current tags */}
                        {editingTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {editingTags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                <Hash className="h-3 w-3 mr-1" />
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  disabled={saving}
                                  className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`${isDark ? 'text-gray-100' : 'text-gray-900'} whitespace-pre-wrap leading-relaxed text-lg`}>
                    {note.content}
                  </div>
                )}
              </div>
            )}

            {/* Attachments */}
            {allAttachments.length > 0 && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className={`text-lg font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
                    Attachments {allAttachments.length > 1 && `(${allAttachments.length})`}
                  </h3>
                  
                  {/* Attachment Navigation */}
                  {allAttachments.length > 1 && (
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                    <div className={`border rounded-lg p-6 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      {currentAttachment.type === 'image' && (
                        <div className="space-y-4">
                          {/* Image Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={zoomOut}>
                                <ZoomOut className="h-4 w-4" />
                              </Button>
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{imageZoom}%</span>
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
                              className="rounded border border-gray-200 max-h-screen"
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
                              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                      <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>Size: {formatFileSize(currentAttachment.fileSize)}</span>
                          {currentAttachment.caption && (
                            <span className="italic">"{currentAttachment.caption}"</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {isEnhancedMode && note.tags && note.tags.length > 0 && (
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
                <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center`}>
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'} px-8 py-4`}>
            <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center space-x-4">
                <span>Created: {formatDate(note.created_at)}</span>
                {note.updated_at && note.updated_at !== note.created_at && (
                  <span>• Last edited: {formatDate(note.updated_at)}</span>
                )}
                {isEnhancedMode && note.is_favorite && (
                  <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                    • <Star className="h-3 w-3 mr-1 fill-current" /> Favorite
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="capitalize">{note.content_type} Note</span>
                {allAttachments.length > 0 && (
                  <span>• {allAttachments.length} attachment{allAttachments.length > 1 ? 's' : ''}</span>
                )}
                {isEnhancedMode && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Enhanced Mode
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

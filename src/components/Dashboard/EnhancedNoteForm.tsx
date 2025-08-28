import React, { useState, useRef } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent } from '../ui/Card'
import { 
  Plus, PenTool, Image, Mic, FileText, X, Tag, Star, 
  Eye, Upload, Paperclip, Type, Hash
} from 'lucide-react'
import { NoteContentType } from '../../lib/supabase'
import { CreateNoteData } from '../../hooks/useEnhancedNotes'

interface EnhancedNoteFormProps {
  onSubmit: (noteData: CreateNoteData) => Promise<void>
  availableTags: string[]
}

interface AttachmentPreview {
  file: File
  type: 'image' | 'audio'
  previewUrl?: string
  caption?: string
}

export const EnhancedNoteForm: React.FC<EnhancedNoteFormProps> = ({ 
  onSubmit, 
  availableTags 
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState<NoteContentType>('text')
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() && attachments.length === 0) {
      return
    }

    try {
      setLoading(true)
      
      const noteData: CreateNoteData = {
        title: title.trim() || undefined,
        content: content.trim(),
        contentType: attachments.length > 0 ? 'mixed' : contentType,
        attachments: attachments.map(att => att.file),
        tags: tags.length > 0 ? tags : undefined,
        isFavorite
      }
      
      await onSubmit(noteData)
      
      // Reset form
      resetForm()
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setAttachments([])
    setTags([])
    setNewTag('')
    setIsFavorite(false)
    setContentType('text')
    setShowPreview(false)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
    
    // Clean up preview URLs
    attachments.forEach(att => {
      if (att.previewUrl) {
        URL.revokeObjectURL(att.previewUrl)
      }
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'audio'
      let previewUrl: string | undefined
      
      if (fileType === 'image') {
        previewUrl = URL.createObjectURL(file)
      }
      
      const newAttachment: AttachmentPreview = {
        file,
        type: fileType,
        previewUrl
      }
      
      setAttachments(prev => [...prev, newAttachment])
    })
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (index: number) => {
    const attachment = attachments[index]
    if (attachment.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl)
    }
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const updateAttachmentCaption = (index: number, caption: string) => {
    setAttachments(prev => prev.map((att, i) => 
      i === index ? { ...att, caption } : att
    ))
  }

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const addExistingTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
  }

  const isFormValid = () => {
    return content.trim().length > 0 || attachments.length > 0
  }

  const getSubmitButtonText = () => {
    if (attachments.length > 0) {
      return `Create Mixed Note (${attachments.length} files)`
    }
    return 'Create Note'
  }

  const renderPreview = () => {
    if (!showPreview) return null

    return (
      <Card className="mt-4 bg-gray-50 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700 flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            
            {content && (
              <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
            )}
            
            {attachments.map((attachment, index) => (
              <div key={index} className="border rounded-lg p-3 bg-white">
                {attachment.type === 'image' && attachment.previewUrl && (
                  <img
                    src={attachment.previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-32 rounded object-cover"
                  />
                )}
                
                {attachment.type === 'audio' && (
                  <div className="flex items-center space-x-2">
                    <Mic className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{attachment.file.name}</span>
                  </div>
                )}
                
                {attachment.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">{attachment.caption}</p>
                )}
              </div>
            ))}
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
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
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={contentType === 'text' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setContentType('text')}
                disabled={loading}
              >
                <Type className="h-4 w-4 mr-1" />
                Text
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Paperclip className="h-4 w-4 mr-1" />
                Attach Files
              </Button>
              <Button
                type="button"
                variant={isFavorite ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                disabled={loading}
              >
                <Star className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
                Favorite
              </Button>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!isFormValid()}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Title input */}
          <div className="relative">
            <PenTool className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title (optional)..."
              disabled={loading}
              className="w-full pl-10 bg-white/60 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Content input */}
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Write your note content..."
              disabled={loading}
              rows={4}
              className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <Paperclip className="h-4 w-4 mr-1" />
                Attachments ({attachments.length})
              </h4>
              
              {attachments.map((attachment, index) => (
                <div key={index} className="relative border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    {attachment.type === 'image' && attachment.previewUrl && (
                      <img
                        src={attachment.previewUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                    )}
                    
                    {attachment.type === 'audio' && (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <Mic className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      <Input
                        value={attachment.caption || ''}
                        onChange={(e) => updateAttachmentCaption(index, e.target.value)}
                        placeholder="Add caption (optional)..."
                        className="mt-2 text-xs"
                        size="sm"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="flex-shrink-0 p-1 h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tags section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags..."
                className="flex-1 text-sm"
                size="sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
            
            {/* Available tags */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 10)
                  .map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addExistingTag(tag)}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  ))}
              </div>
            )}
            
            {/* Selected tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {renderPreview()}

          {/* Submit button */}
          <Button
            type="submit"
            loading={loading}
            disabled={!isFormValid()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            {getSubmitButtonText()}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
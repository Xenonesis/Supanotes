import React, { useState, useRef } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent } from '../ui/Card'
import { Plus, PenTool, Image, Mic, FileText, X } from 'lucide-react'
import { NoteContentType } from '../../lib/supabase'

interface NoteFormProps {
  onSubmit: (content: string) => Promise<void>
  onMultimediaSubmit: (content: string, contentType: NoteContentType, file?: File) => Promise<void>
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onMultimediaSubmit }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedContentType, setSelectedContentType] = useState<NoteContentType>('text')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() && selectedContentType === 'text') return
    if ((selectedContentType === 'audio' || selectedContentType === 'image') && !selectedFile) return

    try {
      setLoading(true)
      
      if (selectedContentType === 'text') {
        await onSubmit(content.trim())
      } else {
        await onMultimediaSubmit(content.trim() || '', selectedContentType, selectedFile!)
      }
      
      // Reset form
      setContent('')
      setSelectedFile(null)
      setPreviewUrl(null)
      setSelectedContentType('text')
      
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (audioInputRef.current) audioInputRef.current.value = ''
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setSelectedContentType(type)

    // Create preview for images
    if (type === 'image') {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setSelectedContentType('text')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (audioInputRef.current) audioInputRef.current.value = ''
  }

  const getSubmitButtonText = () => {
    switch (selectedContentType) {
      case 'image': return 'Add Image Note'
      case 'audio': return 'Add Audio Note'
      default: return 'Add Note'
    }
  }

  const isFormValid = () => {
    if (selectedContentType === 'text') {
      return content.trim().length > 0
    }
    return selectedFile !== null
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Type Selector */}
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={selectedContentType === 'text' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedContentType('text')
                clearFile()
              }}
              disabled={loading}
            >
              <FileText className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button
              type="button"
              variant={selectedContentType === 'image' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
            <Button
              type="button"
              variant={selectedContentType === 'audio' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => audioInputRef.current?.click()}
              disabled={loading}
            >
              <Mic className="h-4 w-4 mr-1" />
              Audio
            </Button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'image')}
            className="hidden"
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileSelect(e, 'audio')}
            className="hidden"
          />

          {/* Text input */}
          <div className="relative">
            <PenTool className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                selectedContentType === 'text' 
                  ? "What's on your mind? Write a new note..."
                  : `Add a caption for your ${selectedContentType}... (optional)`
              }
              disabled={loading}
              className="w-full pl-10 bg-white/60 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* File preview */}
          {selectedFile && (
            <div className="relative">
              {selectedContentType === 'image' && previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-48 rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {selectedContentType === 'audio' && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Mic className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={clearFile}
                    className="rounded-full p-1 h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

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

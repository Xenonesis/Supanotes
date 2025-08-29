import React, { useState, useRef } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent } from '../ui/Card'
import { RichTextEditor } from '../ui/RichTextEditor'
import { Plus, PenTool, Image, Mic, FileText, X, Eye, Type } from 'lucide-react'
import { NoteContentType } from '../../lib/supabase'

const convertMarkdownToHtml = (markdown: string) => {
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    .replace(/__(.*?)__/gim, '<u class="underline">$1</u>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n/gim, '<br>')
}

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
  const [showPreview, setShowPreview] = useState(false)
  const [useRichText, setUseRichText] = useState(false)
  
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
          <div className="space-y-3">
            {selectedContentType === 'text' && (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseRichText(!useRichText)}
                  className="h-7 px-2"
                >
                  <Type className="h-3 w-3 mr-1" />
                  {useRichText ? 'Plain Text' : 'Rich Text'}
                </Button>
              </div>
            )}
            
            {useRichText && selectedContentType === 'text' ? (
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="What's on your mind? Write a new note..."
                disabled={loading}
                className="w-full"
              />
            ) : (
              <div className="relative">
                <PenTool className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    selectedContentType === 'text' 
                      ? "What's on your mind? Write a new note..."
                      : `Add a caption for your ${selectedContentType}... (optional)`
                  }
                  disabled={loading}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
            )}
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

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isFormValid() && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            
            <Button
              type="submit"
              loading={loading}
              disabled={!isFormValid()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {getSubmitButtonText()}
            </Button>
          </div>
        </form>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPreview(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  {selectedContentType === 'image' && <Image className="h-5 w-5 text-blue-500" />}
                  {selectedContentType === 'audio' && <Mic className="h-5 w-5 text-green-500" />}
                  {selectedContentType === 'text' && <FileText className="h-5 w-5 text-gray-500" />}
                  <h2 className="text-lg font-semibold text-gray-900">
                    Note Preview
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={async () => {
                      setShowPreview(false)
                      await handleSubmit(new Event('submit') as any)
                    }}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {getSubmitButtonText()}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                {/* Text Content */}
                {content && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Content</h4>
                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg border"
                        dangerouslySetInnerHTML={{ 
                          __html: convertMarkdownToHtml(content) 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* File Preview */}
                {selectedFile && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Attachment</h4>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      {selectedContentType === 'image' && previewUrl && (
                        <div className="flex justify-center">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-64 rounded border border-gray-200"
                          />
                        </div>
                      )}
                      
                      {selectedContentType === 'audio' && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mic className="h-5 w-5 text-gray-500" />
                            <span className="text-sm text-gray-700 font-medium">
                              {selectedFile.name}
                            </span>
                          </div>
                          <audio controls className="w-full">
                            <source src={URL.createObjectURL(selectedFile)} />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <span>Size: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                          <span className="mx-2">•</span>
                          <span>Type: {selectedFile.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!content && !selectedFile && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No content to preview</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>This is how your note will appear</span>
                  <span className="capitalize">{selectedContentType} Note</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
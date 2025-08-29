import React, { useState, useRef } from 'react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { 
  X, Download, Upload, FileText, FileJson, FileImage, 
  Archive, Check, AlertCircle, Loader2 
} from 'lucide-react'
import { Note } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface ExportImportModalProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  onImport: (notes: Note[]) => Promise<void>
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  notes,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'txt'>('json')
  const [loading, setLoading] = useState(false)
  const [importPreview, setImportPreview] = useState<Note[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const exportNotes = async () => {
    try {
      setLoading(true)
      let content = ''
      let filename = ''
      let mimeType = ''

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(notes, null, 2)
          filename = `notes-export-${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break
        
        case 'markdown':
          content = notes.map(note => {
            let md = `# ${note.title || 'Untitled Note'}\n\n`
            md += `**Created:** ${new Date(note.created_at).toLocaleDateString()}\n`
            md += `**Type:** ${note.content_type}\n\n`
            if (note.content) {
              md += `${note.content}\n\n`
            }
            if (note.file_url) {
              md += `**Attachment:** ${note.file_url}\n\n`
            }
            md += '---\n\n'
            return md
          }).join('')
          filename = `notes-export-${new Date().toISOString().split('T')[0]}.md`
          mimeType = 'text/markdown'
          break
        
        case 'txt':
          content = notes.map(note => {
            let txt = `${note.title || 'Untitled Note'}\n`
            txt += `Created: ${new Date(note.created_at).toLocaleDateString()}\n`
            txt += `Type: ${note.content_type}\n\n`
            if (note.content) {
              txt += `${note.content}\n\n`
            }
            txt += '----------------------------------------\n\n'
            return txt
          }).join('')
          filename = `notes-export-${new Date().toISOString().split('T')[0]}.txt`
          mimeType = 'text/plain'
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`Exported ${notes.length} notes as ${exportFormat.toUpperCase()}`)
    } catch (error) {
      toast.error('Failed to export notes')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const text = await file.text()
      
      if (file.name.endsWith('.json')) {
        const importedNotes = JSON.parse(text) as Note[]
        setImportPreview(importedNotes)
      } else {
        toast.error('Only JSON files are supported for import')
      }
    } catch (error) {
      toast.error('Failed to parse file')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    try {
      setLoading(true)
      await onImport(importPreview)
      toast.success(`Imported ${importPreview.length} notes`)
      setImportPreview([])
      onClose()
    } catch (error) {
      toast.error('Failed to import notes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Export & Import Notes
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="h-4 w-4 mr-2 inline" />
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="h-4 w-4 mr-2 inline" />
            Import
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'export' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Export {notes.length} notes
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a format to export your notes. JSON format preserves all data and can be imported back.
                </p>
              </div>

              {/* Format Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      exportFormat === 'json' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExportFormat('json')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileJson className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-sm font-medium">JSON</div>
                      <div className="text-xs text-gray-500">Full data</div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      exportFormat === 'markdown' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExportFormat('markdown')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-sm font-medium">Markdown</div>
                      <div className="text-xs text-gray-500">Formatted</div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      exportFormat === 'txt' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExportFormat('txt')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                      <div className="text-sm font-medium">Text</div>
                      <div className="text-xs text-gray-500">Plain text</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button
                onClick={exportNotes}
                loading={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Notes
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Import Notes
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a JSON file exported from this app to import your notes.
                </p>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-4">
                  Drop your JSON file here or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Choose File
                </Button>
              </div>

              {/* Import Preview */}
              {importPreview.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Preview ({importPreview.length} notes)
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {importPreview.slice(0, 5).map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border">
                        <div className="text-sm font-medium">
                          {note.title || 'Untitled Note'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {note.content_type} • {new Date(note.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {importPreview.length > 5 && (
                      <div className="text-xs text-gray-500 text-center">
                        ... and {importPreview.length - 5} more notes
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleImport}
                    loading={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Import {importPreview.length} Notes
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
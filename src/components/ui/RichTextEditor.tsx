import React, { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { 
  Bold, Italic, Underline, List, ListOrdered, Quote, 
  Code, Link, Heading1, Heading2, Heading3, AlignLeft, 
  AlignCenter, AlignRight, Undo, Redo, Type, Palette
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className = ""
}) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F59E0B', 
    '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'
  ]

  useEffect(() => {
    if (editorRef.current && !isMarkdownMode) {
      editorRef.current.innerHTML = convertMarkdownToHtml(value)
    }
  }, [value, isMarkdownMode])

  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/__(.*?)__/gim, '<u>$1</u>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n/gim, '<br>')
  }

  const convertHtmlToMarkdown = (html: string) => {
    return html
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<u>(.*?)<\/u>/gim, '__$1__')
      .replace(/<code>(.*?)<\/code>/gim, '`$1`')
      .replace(/<blockquote>(.*?)<\/blockquote>/gim, '> $1')
      .replace(/<li>(.*?)<\/li>/gim, '* $1')
      .replace(/<br>/gim, '\n')
      .replace(/<[^>]*>/gim, '')
  }

  const execCommand = (command: string, value?: string) => {
    if (disabled) return
    document.execCommand(command, false, value)
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      const markdown = convertHtmlToMarkdown(html)
      onChange(markdown)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            execCommand('redo')
          } else {
            execCommand('undo')
          }
          break
      }
    }
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const heading = document.createElement(`h${level}`)
      heading.textContent = selection.toString() || `Heading ${level}`
      range.deleteContents()
      range.insertNode(heading)
      updateContent()
    }
  }

  const toggleMode = () => {
    if (isMarkdownMode) {
      // Switch to rich text mode
      setIsMarkdownMode(false)
      if (editorRef.current) {
        editorRef.current.innerHTML = convertMarkdownToHtml(value)
      }
    } else {
      // Switch to markdown mode
      setIsMarkdownMode(true)
      if (editorRef.current) {
        const markdown = convertHtmlToMarkdown(editorRef.current.innerHTML)
        onChange(markdown)
      }
    }
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        {/* Mode Toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleMode}
          className="h-8 px-2"
        >
          <Type className="h-3 w-3 mr-1" />
          {isMarkdownMode ? 'Rich' : 'MD'}
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {!isMarkdownMode && (
          <>
            {/* Text Formatting */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('bold')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('italic')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('underline')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Underline className="h-3 w-3" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Headings */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertHeading(1)}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Heading1 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertHeading(2)}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Heading2 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertHeading(3)}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Heading3 className="h-3 w-3" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Lists */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('insertUnorderedList')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <List className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('insertOrderedList')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <ListOrdered className="h-3 w-3" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Alignment */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('justifyLeft')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('justifyCenter')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('justifyRight')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <AlignRight className="h-3 w-3" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Color Picker */}
            <div className="relative group">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
              >
                <Palette className="h-3 w-3" />
              </Button>
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="grid grid-cols-5 gap-1">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSelectedColor(color)
                        execCommand('foreColor', color)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Undo/Redo */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('undo')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Undo className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => execCommand('redo')}
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Redo className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>

      {/* Editor */}
      {isMarkdownMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-48 p-4 border-0 resize-none focus:outline-none font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={updateContent}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-48 p-4 focus:outline-none overflow-y-auto prose prose-sm max-w-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
            disabled ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed' : ''
          }`}
          style={{ minHeight: '12rem' }}
          suppressContentEditableWarning={true}
        />
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {isMarkdownMode ? 'Markdown Mode' : 'Rich Text Mode'} • {value.length} characters
        </span>
        <span>
          {isFocused ? 'Editing...' : 'Ready'}
        </span>
      </div>
    </div>
  )
}
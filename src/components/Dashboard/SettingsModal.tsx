import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { 
  X, Palette, Layout as LayoutIcon, Moon, Sun, Monitor,
  Grid3X3, List, Columns, MoreHorizontal, Download, Upload
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLayoutPreferences, Layout, ColorScheme } from '../../hooks/useLayoutPreferences'
import { ExportImportModal } from './ExportImportModal'
import { Note } from '../../lib/supabase'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  onImport: (notes: Note[]) => Promise<void>
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notes,
  onImport
}) => {
  const { theme, setTheme } = useTheme()
  const { layout, setLayout, colorScheme, setColorScheme } = useLayoutPreferences()
  const [showExportImport, setShowExportImport] = useState(false)

  if (!isOpen) return null

  const themes = [
    { key: 'light' as const, icon: <Sun className="h-4 w-4" />, label: 'Light' },
    { key: 'dark' as const, icon: <Moon className="h-4 w-4" />, label: 'Dark' },
    { key: 'system' as const, icon: <Monitor className="h-4 w-4" />, label: 'System' },
  ]

  const layouts: { key: Layout; icon: React.ReactNode; label: string; description: string }[] = [
    { 
      key: 'grid', 
      icon: <Grid3X3 className="h-5 w-5" />, 
      label: 'Grid', 
      description: 'Cards in a responsive grid' 
    },
    { 
      key: 'list', 
      icon: <List className="h-5 w-5" />, 
      label: 'List', 
      description: 'Full-width list view' 
    },
    { 
      key: 'masonry', 
      icon: <Columns className="h-5 w-5" />, 
      label: 'Masonry', 
      description: 'Pinterest-style layout' 
    },
    { 
      key: 'compact', 
      icon: <MoreHorizontal className="h-5 w-5" />, 
      label: 'Compact', 
      description: 'Dense grid with minimal details' 
    },
  ]

  const colorSchemes: { key: ColorScheme; color: string; label: string }[] = [
    { key: 'blue', color: 'bg-blue-500', label: 'Blue' },
    { key: 'purple', color: 'bg-purple-500', label: 'Purple' },
    { key: 'green', color: 'bg-green-500', label: 'Green' },
    { key: 'orange', color: 'bg-orange-500', label: 'Orange' },
    { key: 'pink', color: 'bg-pink-500', label: 'Pink' },
    { key: 'indigo', color: 'bg-indigo-500', label: 'Indigo' },
  ]

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Settings & Preferences
            </h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            
            {/* Theme Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Appearance
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map(({ key, icon, label }) => (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all ${
                          theme === key 
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setTheme(key)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="flex justify-center mb-2">{icon}</div>
                          <div className="text-sm font-medium">{label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {colorSchemes.map(({ key, color, label }) => (
                      <button
                        key={key}
                        onClick={() => setColorScheme(key)}
                        className={`relative w-12 h-12 rounded-lg ${color} transition-all hover:scale-110 ${
                          colorScheme === key ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                        }`}
                        title={label}
                      >
                        {colorScheme === key && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <LayoutIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Layout
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {layouts.map(({ key, icon, label, description }) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all ${
                      layout === key 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setLayout(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">{icon}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Data Management
                </h3>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setShowExportImport(true)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Upload className="h-4 w-4 mr-3" />
                  Export & Import Notes
                  <span className="ml-auto text-xs text-gray-500">
                    {notes.length} notes
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Settings are saved automatically</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export/Import Modal */}
      <ExportImportModal
        isOpen={showExportImport}
        onClose={() => setShowExportImport(false)}
        notes={notes}
        onImport={onImport}
      />
    </>
  )
}
import React, { useState } from 'react'
import { Header } from './Header'
import { EnhancedNoteForm } from './EnhancedNoteForm'
import { EnhancedNoteCard } from './EnhancedNoteCard'
import { NotesSearchFilter } from './NotesSearchFilter'
import { LoadingSpinner } from '../LoadingSpinner'
import { useCompatibleNotes } from '../../hooks/useCompatibleNotes'
import { Note } from '../../lib/supabase'
import { 
  Plus, Grid, List, SortDesc, SortAsc, Calendar, 
  Star, TrendingUp, BarChart3, Filter, AlertCircle, 
  ExternalLink, Database
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

type ViewMode = 'grid' | 'list'
type SortMode = 'newest' | 'oldest' | 'alphabetical' | 'favorites'

export const EnhancedDashboard: React.FC = () => {
  const {
    notes,
    loading,
    availableTags,
    searchFilters,
    isEnhancedMode,
    createNote,
    deleteNote,
    toggleFavorite,
    recordNoteView,
    setSearchFilters
  } = useCompatibleNotes()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleCreateNote = async (noteData: any) => {
    await createNote(noteData)
    setShowForm(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleNoteView = (noteId: string) => {
    recordNoteView(noteId)
  }

  const getSortedNotes = () => {
    const sortedNotes = [...notes]
    
    switch (sortMode) {
      case 'oldest':
        return sortedNotes.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      case 'alphabetical':
        return sortedNotes.sort((a, b) => {
          const titleA = a.title || a.content || ''
          const titleB = b.title || b.content || ''
          return titleA.localeCompare(titleB)
        })
      case 'favorites':
        return sortedNotes.sort((a, b) => {
          if (a.is_favorite && !b.is_favorite) return -1
          if (!a.is_favorite && b.is_favorite) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      case 'newest':
      default:
        return sortedNotes.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  }

  const getStats = () => {
    const totalNotes = notes.length
    const favoriteNotes = notes.filter(note => note.is_favorite).length
    const textNotes = notes.filter(note => note.content_type === 'text').length
    const imageNotes = notes.filter(note => note.content_type === 'image').length
    const audioNotes = notes.filter(note => note.content_type === 'audio').length
    const mixedNotes = notes.filter(note => note.content_type === 'mixed').length
    
    return {
      totalNotes,
      favoriteNotes,
      textNotes,
      imageNotes,
      audioNotes,
      mixedNotes
    }
  }

  const stats = getStats()
  const sortedNotes = getSortedNotes()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-8">
          {/* Upgrade Banner */}
          {!isEnhancedMode && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Upgrade Available: Enhanced Notes Features
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">
                      You're using the basic version. Upgrade your database to unlock:
                      <strong> Mixed content notes, Advanced search, Tags, Favorites, and more!</strong>
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => window.open('enhanced_database_setup.sql', '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Setup Guide
                      </Button>
                      <span className="text-xs text-blue-600">
                        Run the SQL setup to enable all features
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Welcome Section with Stats */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4 animate-pulse-slow">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Enhanced Notes Workspace</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up">My Notes</h2>
            <p className="text-gray-600 text-lg mb-6 animate-fade-in-up stagger-1">
              Create, organize, and manage your thoughts with text, images, audio, and mixed content
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 animate-fade-in-up stagger-2">
              <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 transition-all duration-300 hover:scale-110">{stats.totalNotes}</div>
                  <div className="text-xs text-gray-600">Total Notes</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 transition-all duration-300 hover:scale-110">{stats.favoriteNotes}</div>
                  <div className="text-xs text-gray-600">Favorites</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600 transition-all duration-300 hover:scale-110">{stats.textNotes}</div>
                  <div className="text-xs text-gray-600">Text</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 transition-all duration-300 hover:scale-110">{stats.imageNotes}</div>
                  <div className="text-xs text-gray-600">Images</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 transition-all duration-300 hover:scale-110">{stats.audioNotes}</div>
                  <div className="text-xs text-gray-600">Audio</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 transition-all duration-300 hover:scale-110">{stats.mixedNotes}</div>
                  <div className="text-xs text-gray-600">Mixed</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filters */}
          <NotesSearchFilter
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            availableTags={availableTags}
            totalNotes={sortedNotes.length}
          />

          {/* Quick Add Button */}
          <div className="flex justify-center animate-fade-in-up stagger-3">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3 interactive-glow"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              {showForm ? 'Cancel' : 'Create New Note'}
            </Button>
          </div>

          {/* Note Form */}
          {showForm && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{editingNote ? 'Edit Note' : 'Create New Note'}</span>
                </h3>
                <EnhancedNoteForm
                  onSubmit={handleCreateNote}
                  availableTags={availableTags}
                />
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm animate-fade-in-up stagger-4">
            <div className="p-6">
              {/* Section Header with Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span>Your Notes</span>
                </h3>
                
                <div className="flex items-center space-x-2">
                  {/* Sort Controls */}
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-soft"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="favorites">Favorites First</option>
                  </select>
                  
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-soft">
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none border-0 interactive-glow"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none border-0 border-l border-gray-200 interactive-glow"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notes Grid/List */}
              {sortedNotes.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="h-12 w-12 mx-auto animate-bounce-gentle" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No notes found</h4>
                  <p className="text-gray-600 mb-4">
                    {Object.keys(searchFilters).length > 0
                      ? 'Try adjusting your search filters or create a new note.'
                      : 'Start by creating your first note with text, images, or audio.'}
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="primary"
                    className="interactive-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Note
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {sortedNotes.map((note, index) => (
                    <div key={note.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <EnhancedNoteCard
                        note={note}
                        onDelete={deleteNote}
                        onToggleFavorite={toggleFavorite}
                        onView={handleNoteView}
                        onEdit={handleEditNote}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Header } from './Header'
import { NoteForm } from './NoteForm'
import { NoteCard } from './NoteCard'
import { LoadingSpinner } from '../LoadingSpinner'
import { useNotes } from '../../hooks/useNotes'
import { Note } from '../../lib/supabase'
import { 
  Plus, Grid, List, Database, ExternalLink, AlertCircle, Search, Filter, SortAsc, SortDesc
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'

type ViewMode = 'grid' | 'list'
type SortMode = 'newest' | 'oldest' | 'title'

export const EnhancedBasicDashboard: React.FC = () => {
  const { notes, loading, createNote, createMultimediaNote, deleteNote } = useNotes()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  // Filter and sort notes
  useEffect(() => {
    let filtered = notes.filter(note => 
      (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredNotes(filtered)
  }, [notes, searchQuery, sortMode])

  const handleNoteView = (noteId: string) => {
    console.log('Viewing note:', noteId)
  }

  const handleCreateNote = async (noteData: any) => {
    try {
      await createNote(noteData)
      setShowForm(false)
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-screen gradient-bg-animated">
      <Header />
      
      <main className="max-w-7xl mx-auto mobile-padding py-8">
        <div className="space-y-8">
          {/* Enhanced Upgrade Banner */}
          <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-700/50 animate-fade-in-up interactive-glow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-float">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mobile-heading font-semibold text-blue-900 dark:text-blue-100">
                    Enhanced Features Available!
                  </h3>
                  <p className="mobile-text text-blue-700 dark:text-blue-300 mt-2">
                    You're using the basic version. Upgrade your database to unlock:
                    <strong className="block sm:inline sm:ml-1">
                      Mixed content notes, Advanced search, Tags, Favorites, and more!
                    </strong>
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 interactive-glow"
                    icon={<ExternalLink />}
                    onClick={() => window.open('/ENHANCED_FEATURES_GUIDE.md', '_blank')}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Controls Section */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 w-full lg:max-w-md">
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search />}
                  variant="glass"
                  className="animate-slide-right"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={sortMode === 'newest' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortMode('newest')}
                    icon={<SortDesc />}
                    className="animate-slide-left"
                  >
                    <span className="hidden sm:inline">Newest</span>
                  </Button>
                  <Button
                    variant={sortMode === 'oldest' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortMode('oldest')}
                    icon={<SortAsc />}
                    className="animate-slide-left"
                    style={{ animationDelay: '0.05s' }}
                  >
                    <span className="hidden sm:inline">Oldest</span>
                  </Button>
                  <Button
                    variant={sortMode === 'title' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortMode('title')}
                    icon={<Filter />}
                    className="animate-slide-left"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <span className="hidden sm:inline">Title</span>
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 glass rounded-xl p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    icon={<Grid />}
                    className="animate-scale-in"
                    aria-label="Grid view"
                  />
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    icon={<List />}
                    className="animate-scale-in"
                    style={{ animationDelay: '0.05s' }}
                    aria-label="List view"
                  />
                </div>

                {/* Create Note Button */}
                <Button
                  onClick={() => setShowForm(!showForm)}
                  variant="primary"
                  size="md"
                  icon={<Plus />}
                  className="interactive-glow animate-scale-in-bounce"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="hidden sm:inline">New Note</span>
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            {searchQuery && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
                <Search className="h-4 w-4" />
                <span>
                  Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} 
                  {searchQuery && ` for "${searchQuery}"`}
                </span>
              </div>
            )}
          </div>

          {/* Note Form */}
          {showForm && (
            <div className="animate-fade-in-up">
              <Card className="glass-strong">
                <CardContent className="p-6">
                  <NoteForm
                    onSubmit={handleCreateNote}
                    onCancel={() => setShowForm(false)}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notes Grid/List */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {filteredNotes.length === 0 ? (
              <Card className="glass text-center">
                <CardContent className="py-16">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto animate-pulse-gentle">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="mobile-heading font-medium text-gray-900 dark:text-gray-100">
                        {searchQuery ? 'No notes found' : 'No notes yet'}
                      </h3>
                      <p className="mobile-text text-gray-500 dark:text-gray-400 mt-2">
                        {searchQuery 
                          ? 'Try adjusting your search terms or create a new note.'
                          : 'Create your first note to get started with NoteMaster.'
                        }
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button
                        onClick={() => setShowForm(true)}
                        variant="primary"
                        size="lg"
                        icon={<Plus />}
                        className="interactive-glow animate-bounce-gentle"
                      >
                        Create Your First Note
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredNotes.map((note, index) => (
                  <div 
                    key={note.id} 
                    className="animate-fade-in-up interactive-lift"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <NoteCard
                      note={note}
                      onView={() => handleNoteView(note.id)}
                      onDelete={() => deleteNote(note.id)}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
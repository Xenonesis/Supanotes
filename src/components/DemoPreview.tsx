import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Calendar, 
  Tag,
  FileText,
  Clock,
  Edit3
} from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { Input } from './ui/Input'
import DatabaseWithRestApi from './ui/database-with-rest-api'

export const DemoPreview: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNote, setSelectedNote] = useState<number | null>(null)

  const demoNotes = [
    {
      id: 1,
      title: "Project Planning Meeting",
      content: "Discussed the roadmap for Q1 2024. Key priorities include user experience improvements, performance optimization, and new feature rollouts.",
      tags: ["work", "planning", "meeting"],
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T11:45:00Z",
      favorite: true
    },
    {
      id: 2,
      title: "Recipe: Homemade Pasta",
      content: "Ingredients: 2 cups flour, 3 eggs, 1 tsp salt. Mix ingredients, knead for 10 minutes, rest for 30 minutes, then roll and cut.",
      tags: ["cooking", "recipe", "italian"],
      created_at: "2024-01-14T18:20:00Z",
      updated_at: "2024-01-14T18:25:00Z",
      favorite: false
    },
    {
      id: 3,
      title: "Book Notes: The Design of Everyday Things",
      content: "Key concepts: Affordances, signifiers, feedback, and conceptual models. Good design makes products understandable and usable.",
      tags: ["books", "design", "ux"],
      created_at: "2024-01-13T20:15:00Z",
      updated_at: "2024-01-13T21:30:00Z",
      favorite: true
    },
    {
      id: 4,
      title: "Travel Itinerary: Tokyo",
      content: "Day 1: Arrive at Narita, check into hotel in Shibuya. Day 2: Visit Senso-ji Temple, explore Asakusa. Day 3: Tsukiji Market, Imperial Palace.",
      tags: ["travel", "japan", "itinerary"],
      created_at: "2024-01-12T14:00:00Z",
      updated_at: "2024-01-12T16:30:00Z",
      favorite: false
    },
    {
      id: 5,
      title: "Workout Routine",
      content: "Monday: Chest & Triceps. Tuesday: Back & Biceps. Wednesday: Legs. Thursday: Shoulders. Friday: Cardio. Weekend: Rest or light activity.",
      tags: ["fitness", "health", "routine"],
      created_at: "2024-01-11T07:00:00Z",
      updated_at: "2024-01-11T07:15:00Z",
      favorite: false
    },
    {
      id: 6,
      title: "Learning Goals 2024",
      content: "1. Master React and TypeScript. 2. Learn Python for data analysis. 3. Improve design skills with Figma. 4. Read 24 books this year.",
      tags: ["goals", "learning", "development"],
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:30:00Z",
      favorite: true
    }
  ]

  const filteredNotes = demoNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 120) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  return (
    <div className="min-h-screen gradient-bg-animated">
      {/* Header */}
      <div className="glass border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="glass hover:glass-strong"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NoteMaster Demo
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/auth/signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Demo Notice */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Interactive Demo</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Explore the interface with sample notes. Sign up to create your own notes and unlock all features!
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass"
              />
            </div>
            
            <Button variant="outline" className="glass hover:glass-strong">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-600 text-white' : 'glass hover:glass-strong'}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'glass hover:glass-strong'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredNotes.map((note, index) => (
            <Card
              key={note.id}
              className={`glass hover:glass-strong transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer group ${
                selectedNote === note.id ? 'ring-2 ring-blue-500 shadow-xl' : ''
              }`}
              onClick={() => setSelectedNote(selectedNote === note.id ? null : note.id)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {note.title}
                  </h3>
                  {note.favorite && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {selectedNote === note.id ? note.content : truncateContent(note.content)}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatDate(note.updated_at)}</span>
                  </div>
                </div>

                {selectedNote === note.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/auth/signup')
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Sign up to edit notes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or clear the search to see all notes.
            </p>
          </div>
        )}

        {/* Database API Component Demo */}
        <div className="mt-16">
          <Card className="glass">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by Modern REST API
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Our note-taking platform uses a robust REST API architecture for seamless data management
                </p>
              </div>
              
              <div className="flex justify-center">
                <DatabaseWithRestApi 
                  title="NoteMaster REST API Integration"
                  circleText="API"
                  lightColor="#3b82f6"
                  badgeTexts={{
                    first: "NOTES",
                    second: "AUTH", 
                    third: "FILES",
                    fourth: "SYNC"
                  }}
                  buttonTexts={{
                    first: "NoteMaster",
                    second: "v2_demo"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="glass max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to create your own notes?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sign up now to start organizing your thoughts with our powerful note-taking platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={() => navigate('/auth/signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Note
                </Button>
                <Button
                  onClick={() => navigate('/auth/signin')}
                  variant="outline"
                  className="glass hover:glass-strong px-8 py-3"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
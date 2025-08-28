import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent } from '../ui/Card'
import { 
  Search, Filter, X, Hash, Star, FileText, Image, Mic, 
  Paperclip, SortDesc, SortAsc, Calendar, Tag
} from 'lucide-react'
import { NoteContentType } from '../../lib/supabase'
import { SearchFilters } from '../../hooks/useEnhancedNotes'

interface NotesSearchFilterProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  availableTags: string[]
  totalNotes: number
}

export const NotesSearchFilter: React.FC<NotesSearchFilterProps> = ({
  filters,
  onFiltersChange,
  availableTags,
  totalNotes
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(filters.query || '')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, query: searchQuery.trim() || undefined })
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    onFiltersChange({ ...filters, query: query.trim() || undefined })
  }

  const toggleContentType = (contentType: NoteContentType) => {
    const newContentType = filters.contentType === contentType ? '' : contentType
    onFiltersChange({ ...filters, contentType: newContentType })
  }

  const toggleFavoriteFilter = () => {
    const newFavorite = filters.isFavorite === true ? null : true
    onFiltersChange({ ...filters, isFavorite: newFavorite })
  }

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    
    onFiltersChange({ 
      ...filters, 
      tags: newTags.length > 0 ? newTags : undefined 
    })
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.contentType) count++
    if (filters.isFavorite) count++
    if (filters.tags && filters.tags.length > 0) count += filters.tags.length
    return count
  }

  const getContentTypeIcon = (type: NoteContentType) => {
    switch (type) {
      case 'text':
        return <FileText className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      case 'audio':
        return <Mic className="h-4 w-4" />
      case 'mixed':
        return <Paperclip className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const quickSearchSuggestions = [
    'today',
    'yesterday',
    'this week',
    'favorite',
    'images',
    'audio'
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, content, or tags..."
                className="pl-10 bg-white/60"
              />
            </div>
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={getActiveFiltersCount() > 0 ? 'bg-blue-50 border-blue-200' : ''}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="ml-1 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>
          </form>

          {/* Quick Search Suggestions */}
          {!filters.query && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 self-center">Quick search:</span>
              {quickSearchSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleQuickSearch(suggestion)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Content Type Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content Type</label>
                <div className="flex flex-wrap gap-2">
                  {(['text', 'image', 'audio', 'mixed'] as NoteContentType[]).map(type => (
                    <Button
                      key={type}
                      variant={filters.contentType === type ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleContentType(type)}
                      className="flex items-center space-x-1"
                    >
                      {getContentTypeIcon(type)}
                      <span className="capitalize">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Favorite Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Special Filters</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.isFavorite === true ? 'primary' : 'outline'}
                    size="sm"
                    onClick={toggleFavoriteFilter}
                    className="flex items-center space-x-1"
                  >
                    <Star className={`h-4 w-4 ${filters.isFavorite ? 'fill-current' : ''}`} />
                    <span>Favorites Only</span>
                  </Button>
                </div>
              </div>

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags.map(tag => {
                      const isSelected = filters.tags?.includes(tag) || false
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${
                            isSelected
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                          {isSelected && <X className="h-3 w-3 ml-1" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
            <span>
              {totalNotes} note{totalNotes !== 1 ? 's' : ''} found
            </span>
            
            {/* Active Filters Summary */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center space-x-2">
                {filters.query && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <Search className="h-3 w-3 mr-1" />
                    "{filters.query}"
                  </span>
                )}
                
                {filters.contentType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {getContentTypeIcon(filters.contentType)}
                    <span className="ml-1 capitalize">{filters.contentType}</span>
                  </span>
                )}
                
                {filters.isFavorite && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Favorites
                  </span>
                )}
                
                {filters.tags && filters.tags.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    <Hash className="h-3 w-3 mr-1" />
                    {filters.tags.length} tag{filters.tags.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
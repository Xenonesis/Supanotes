import React from 'react'
import { Search, Filter, SortAsc, SortDesc, Grid, List, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type ViewMode = 'grid' | 'list'
type SortMode = 'newest' | 'oldest' | 'title'

interface SearchControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortMode: SortMode
  onSortChange: (mode: SortMode) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onCreateNote: () => void
  totalNotes: number
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  searchQuery,
  onSearchChange,
  sortMode,
  onSortChange,
  viewMode,
  onViewModeChange,
  onCreateNote,
  totalNotes
}) => {
  return (
    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:max-w-md">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onSortChange('newest')}
              icon={<SortDesc />}
              className="animate-slide-left"
            >
              <span className="hidden sm:inline">Newest</span>
            </Button>
            <Button
              variant={sortMode === 'oldest' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('oldest')}
              icon={<SortAsc />}
              className="animate-slide-left"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="hidden sm:inline">Oldest</span>
            </Button>
            <Button
              variant={sortMode === 'title' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('title')}
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
              onClick={() => onViewModeChange('grid')}
              icon={<Grid />}
              className="animate-scale-in"
              aria-label="Grid view"
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              icon={<List />}
              className="animate-scale-in"
              style={{ animationDelay: '0.05s' }}
              aria-label="List view"
            />
          </div>

          {/* Create Note Button */}
          <Button
            onClick={onCreateNote}
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
            Found {totalNotes} note{totalNotes !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
        </div>
      )}
    </div>
  )
}
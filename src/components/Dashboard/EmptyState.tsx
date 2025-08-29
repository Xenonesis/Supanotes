import React from 'react'
import { AlertCircle, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

interface EmptyStateProps {
  hasSearchQuery: boolean
  onCreateNote: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchQuery,
  onCreateNote
}) => {
  return (
    <Card className="glass text-center">
      <CardContent className="py-16">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto animate-pulse-gentle">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="mobile-heading font-medium text-gray-900 dark:text-gray-100">
              {hasSearchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="mobile-text text-gray-500 dark:text-gray-400 mt-2">
              {hasSearchQuery
                ? 'Try adjusting your search terms or create a new note.'
                : 'Create your first note to get started with NoteMaster.'
              }
            </p>
          </div>
          {!hasSearchQuery && (
            <Button
              onClick={onCreateNote}
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
  )
}
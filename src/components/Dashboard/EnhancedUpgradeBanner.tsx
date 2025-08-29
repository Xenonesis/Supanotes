import React from 'react'
import { Database, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

export const EnhancedUpgradeBanner: React.FC = () => {
  const handleLearnMore = () => {
    window.open('/ENHANCED_FEATURES_GUIDE.md', '_blank')
  }

  return (
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
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
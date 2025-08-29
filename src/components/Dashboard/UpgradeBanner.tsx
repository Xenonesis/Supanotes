import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { AlertCircle, Database, ExternalLink } from 'lucide-react'

interface UpgradeBannerProps {
  isEnhancedMode: boolean
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ isEnhancedMode }) => {
  if (isEnhancedMode) {
    return null
  }

  return (
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
  )
}

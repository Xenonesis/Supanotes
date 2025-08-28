import React from 'react'
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface ClockSkewWarningProps {
  onDismiss?: () => void
  onRefresh?: () => void
}

export const ClockSkewWarning: React.FC<ClockSkewWarningProps> = ({ 
  onDismiss, 
  onRefresh 
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Authentication Issue Detected
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                There's a time synchronization issue between your device and our servers. 
                This can happen when your system clock is incorrect.
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">
                    Current time: {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleRefresh}
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Page</span>
              </Button>
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  variant="outline"
                  size="sm"
                >
                  Dismiss
                </Button>
              )}
            </div>
            <div className="mt-3 text-xs text-amber-600">
              <p>
                <strong>To fix this:</strong> Check your system clock settings and ensure 
                it's set to the correct time zone and synchronized with internet time.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
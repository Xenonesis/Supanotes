import React from 'react'
import { Logo } from './ui/Logo'

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <Logo size="xl" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">NoteMaster</h3>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

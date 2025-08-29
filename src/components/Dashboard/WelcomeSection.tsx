import React from 'react'
import { StatsSection } from './StatsSection'

interface WelcomeSectionProps {
  stats: {
    totalNotes: number
    favoriteNotes: number
    textNotes: number
    imageNotes: number
    audioNotes: number
    mixedNotes: number
  }
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ stats }) => {
  return (
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
      <StatsSection stats={stats} />
    </div>
  )
}

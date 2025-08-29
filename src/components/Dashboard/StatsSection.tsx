import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { BarChart3 } from 'lucide-react'
import { Button } from '../ui/Button'

interface StatsSectionProps {
  stats: {
    totalNotes: number
    favoriteNotes: number
    textNotes: number
    imageNotes: number
    audioNotes: number
    mixedNotes: number
  }
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 animate-fade-in-up stagger-2">
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 transition-all duration-300 hover:scale-110">{stats.totalNotes}</div>
          <div className="text-xs text-gray-600">Total Notes</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 transition-all duration-300 hover:scale-110">{stats.favoriteNotes}</div>
          <div className="text-xs text-gray-600">Favorites</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600 transition-all duration-300 hover:scale-110">{stats.textNotes}</div>
          <div className="text-xs text-gray-600">Text</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 transition-all duration-300 hover:scale-110">{stats.imageNotes}</div>
          <div className="text-xs text-gray-600">Images</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 transition-all duration-300 hover:scale-110">{stats.audioNotes}</div>
          <div className="text-xs text-gray-600">Audio</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-soft interactive-lift">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 transition-all duration-300 hover:scale-110">{stats.mixedNotes}</div>
          <div className="text-xs text-gray-600">Mixed</div>
        </CardContent>
      </Card>
    </div>
  )
}

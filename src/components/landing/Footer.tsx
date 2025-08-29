import React from 'react'
import { Lock, Globe } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useTheme } from '../../contexts/ThemeContext'

export const Footer: React.FC = () => {
  const { isDark } = useTheme()
  
  return (
    <footer className={`relative px-6 py-12 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0C0C0C] via-blue-900 to-indigo-900 text-white' 
        : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Logo size="md" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">NoteMaster</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-200">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-200">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Available Worldwide</span>
            </div>
          </div>
        </div>
        
        <div className={`border-t mt-8 pt-8 text-center text-sm ${
          isDark ? 'border-blue-800/30 text-blue-200' : 'border-blue-800/30 text-blue-200'
        }`}>
          <p>&copy; 2024 NoteMaster. All rights reserved. Built with ❤️ for better note-taking.</p>
        </div>
      </div>
    </footer>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { ThemeToggleIcon } from '../ui/ThemeToggle'
import { useTheme } from '../../contexts/ThemeContext'

interface NavigationProps {
  scrolled: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ scrolled }) => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/30 dark:bg-[#0C0C0C]/30 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20' 
        : 'bg-white/80 dark:bg-[#0C0C0C]/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo size="lg" className="animate-pulse" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            NoteMaster
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggleIcon />
          <Button
            onClick={() => navigate('/auth/signin')}
            variant="outline"
            className={`${
              isDark 
                ? 'bg-gray-800/90 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:text-white' 
                : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:text-gray-900'
            } backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md`}
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/auth/signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggleIcon />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-primary-500 dark:focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 animate-fade-in-up">
          <div className="glass rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  navigate('/auth/signin')
                  setMobileMenuOpen(false)
                }}
                variant="outline"
                size="md"
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  navigate('/auth/signup')
                  setMobileMenuOpen(false)
                }}
                size="md"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

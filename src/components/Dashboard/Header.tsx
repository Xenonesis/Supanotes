import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { ThemeToggleIcon } from '../ui/ThemeToggle'
import { LogOut, User, Menu, X } from 'lucide-react'

export const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
 const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

   return (
    <header className={`transition-all duration-300 ${
      scrolled 
        ? 'bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border-b border-white/10 dark:border-gray-700/30' 
        : 'glass-strong border-b border-white/20 dark:border-gray-700/50'
    } mobile-padding py-3 sm:py-4 sticky top-0 z-50 animate-fade-in-down`} style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 animate-slide-right">
            <div className="interactive-lift">
              <Logo size="lg" />
            </div>
            <div>
              <h1 className="mobile-heading font-bold text-gray-900 dark:text-gray-100">NoteMaster</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Secure note-taking made simple</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 glass rounded-xl px-4 py-2 animate-slide-left">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 rounded-full flex items-center justify-center interactive-glow">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.user_metadata?.full_name || 'User'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
              </div>
            </div>
            
            <ThemeToggleIcon />
            
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              icon={<LogOut />}
            >
              <span className="hidden lg:inline">Sign Out</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggleIcon />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="touch-target"
              icon={mobileMenuOpen ? <X /> : <Menu />}
              aria-label="Toggle mobile menu"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 animate-fade-in-up">
            <div className="glass rounded-2xl p-4 space-y-4 shadow-lg">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.user_metadata?.full_name || 'User'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <ThemeToggleIcon />
                </div>
                <div className="flex-1">
                  <Button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    size="md"
                    className="w-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                    icon={<LogOut />}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

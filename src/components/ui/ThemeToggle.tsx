import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from './Button'
import { cn } from '../../lib/utils'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Light'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative"
      title={`Current theme: ${getLabel()}. Click to cycle through themes.`}
    >
      <span className="sr-only">Toggle theme</span>
      {getIcon()}
      <span className="hidden sm:inline ml-2">{getLabel()}</span>
    </Button>
  )
}

export const ThemeToggleIcon: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      case 'system':
        return <Monitor className="h-5 w-5" />
      default:
        return <Sun className="h-5 w-5" />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2",
        isDark 
          ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white"
      )}
      title={`Current theme: ${theme}. Click to cycle through themes.`}
    >
      <span className="sr-only">Toggle theme</span>
      {getIcon()}
    </button>
  )
}
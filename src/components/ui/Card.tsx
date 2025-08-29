import React from 'react'
import { cn } from '../../lib/utils'
import { useTheme } from '../../contexts/ThemeContext'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated' | 'bordered'
  interactive?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  interactive = false 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = 'rounded-2xl transition-all duration-200'
  
  const variantClasses = {
    default: isDark 
      ? 'bg-gray-800 border border-gray-700 shadow-soft' 
      : 'bg-white border border-gray-200 shadow-soft',
    glass: 'glass shadow-soft-lg',
    elevated: isDark 
      ? 'bg-gray-800 border border-gray-700 shadow-soft-lg' 
      : 'bg-white border border-gray-200 shadow-soft-lg',
    bordered: isDark 
      ? 'bg-gray-800 border-2 border-gray-700' 
      : 'bg-white border-2 border-gray-200',
  }
  
  const interactiveClasses = interactive 
    ? 'interactive-lift cursor-pointer focus-visible-ring' 
    : 'hover:shadow-md'

  return (
    <div className={cn(baseClasses, variantClasses[variant], interactiveClasses, className)}>
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={cn('px-6 py-5', isDark ? 'border-b border-gray-700' : 'border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  )
}

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
  const { isDark } = useTheme();
  
  return (
    <h3 className={cn('text-lg font-semibold', isDark ? 'text-gray-100' : 'text-gray-900', className)}>
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => {
  const { isDark } = useTheme();
  
  return (
    <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600', className)}>
      {children}
    </p>
  )
}

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={cn('px-6 py-4 rounded-b-2xl', 
      isDark 
        ? 'border-t border-gray-700 bg-gray-800/50' 
        : 'border-t border-gray-200 bg-gray-50', 
      className)}>
      {children}
    </div>
  )
}

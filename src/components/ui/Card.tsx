import React from 'react'
import { cn } from '../../lib/utils'

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
  const baseClasses = 'rounded-2xl transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft',
    glass: 'glass shadow-soft-lg',
    elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft-lg',
    bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
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
  return (
    <div className={cn('px-6 py-5 border-b border-gray-200 dark:border-gray-700', className)}>
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
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)}>
      {children}
    </p>
  )
}

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl', className)}>
      {children}
    </div>
  )
}

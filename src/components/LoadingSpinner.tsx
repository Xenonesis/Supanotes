import React from 'react'
import { Logo } from './ui/Logo'
import { cn } from '../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse'
  className?: string
  text?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className,
  text,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  const DefaultSpinner = () => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-primary-600 dark:border-t-primary-400',
      sizeClasses[size]
    )} />
  )

  const DotsSpinner = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce',
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  )

  const PulseSpinner = () => (
    <div className={cn(
      'rounded-full bg-primary-600 dark:bg-primary-400 animate-pulse-gentle',
      sizeClasses[size]
    )} />
  )

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />
      case 'pulse':
        return <PulseSpinner />
      default:
        return <DefaultSpinner />
    }
  }

  // Full screen loading with branding
  if (fullScreen) {
    return (
      <div className="min-h-screen gradient-bg-animated flex items-center justify-center" role="status" aria-label="Loading application">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="glass-strong rounded-2xl p-6 shadow-soft-lg animate-float interactive-glow">
              <Logo size="xl" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="mobile-heading font-semibold text-gray-900 dark:text-gray-100 animate-fade-in-up">
              NoteMaster
            </h3>
            <p className="mobile-text text-gray-600 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Loading your workspace...
            </p>
          </div>
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <LoadingSpinner size="lg" variant="dots" />
          </div>
          <div className="sr-only" aria-live="polite">
            Application is loading, please wait...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)} role="status" aria-label={text || 'Loading'}>
      {renderSpinner()}
      {text && (
        <p className="mobile-text text-gray-600 dark:text-gray-400 animate-pulse-gentle" aria-live="polite">
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Full screen loading overlay component
export const FullScreenLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-strong rounded-2xl p-8 shadow-soft-lg animate-scale-in">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

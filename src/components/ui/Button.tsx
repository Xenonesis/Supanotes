import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden group touch-target'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft hover:shadow-soft-lg dark:bg-primary-600 dark:hover:bg-primary-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 shadow-soft hover:shadow-soft-lg',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-soft hover:shadow-soft-lg dark:bg-danger-600 dark:hover:bg-danger-700',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-soft hover:shadow-soft-lg dark:bg-success-600 dark:hover:bg-success-700',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-soft hover:shadow-soft-lg dark:bg-warning-600 dark:hover:bg-warning-700',
    outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
  }
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3',
  }

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  }

  const LoadingSpinner = () => (
    <svg 
      className={cn('animate-spin', iconSizes[size])} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  )

  const renderIcon = () => {
    if (loading) return <LoadingSpinner />
    if (!icon) return null
    
    return React.cloneElement(icon as React.ReactElement, {
      className: cn(iconSizes[size], (icon as React.ReactElement).props?.className)
    })
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl" />
      </span>
      
      {/* Content */}
      <span className="relative flex items-center gap-inherit">
        {(icon && iconPosition === 'left') && renderIcon()}
        {children}
        {(icon && iconPosition === 'right') && renderIcon()}
      </span>
    </button>
  )
}

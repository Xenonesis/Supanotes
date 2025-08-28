import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed touch-target'
  
  const variantClasses = {
    default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400',
    filled: 'border-0 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2',
    glass: 'glass border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-5 py-3 text-base rounded-xl',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const paddingWithIcon = {
    sm: iconPosition === 'left' ? 'pl-10' : 'pr-10',
    md: iconPosition === 'left' ? 'pl-12' : 'pr-12',
    lg: iconPosition === 'left' ? 'pl-14' : 'pr-14',
  }

  const iconPositionClasses = {
    sm: iconPosition === 'left' ? 'left-3' : 'right-3',
    md: iconPosition === 'left' ? 'left-4' : 'right-4',
    lg: iconPosition === 'left' ? 'left-5' : 'right-5',
  }

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block mobile-text font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none',
            iconPositionClasses[size]
          )}>
            {React.cloneElement(icon as React.ReactElement, {
              className: cn(iconSizes[size], (icon as React.ReactElement).props?.className)
            })}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            icon && paddingWithIcon[size],
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
            className
          )}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <div className="space-y-1">
          {error && (
            <p className="text-sm text-danger-600 dark:text-danger-400 flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

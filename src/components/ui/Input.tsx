import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { useTheme } from '../../contexts/ThemeContext'

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
  const { isDark } = useTheme();
  
  const baseClasses = 'w-full transition-all duration-200 focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed touch-target'
  
  const variantClasses = {
    default: isDark 
      ? 'border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:border-primary-400' 
      : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary-500',
    filled: isDark 
      ? 'border-0 bg-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-800 focus:ring-2' 
      : 'border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2',
    glass: isDark 
      ? 'glass border-gray-700/50 text-gray-100 placeholder-gray-400' 
      : 'glass border-white/20 text-gray-900 placeholder-gray-500',
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
          className={cn("block mobile-text font-medium", isDark ? "text-gray-300" : "text-gray-700")}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute top-1/2 transform -translate-y-1/2 pointer-events-none',
            isDark ? 'text-gray-500' : 'text-gray-400',
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
            <p className={cn("text-sm flex items-center gap-1", isDark ? "text-danger-400" : "text-danger-600")}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

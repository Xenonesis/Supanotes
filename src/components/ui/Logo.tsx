import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  // Theme-aware colors
  const logoColor = isDark ? '#60a5fa' : '#3b82f6';

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <g className="animate-pulse">
          {/* Central circle */}
          <circle cx="12" cy="12" r="2" fill={logoColor} />
          
          {/* Radiating segments */}
          <rect x="11" y="4" width="2" height="4" rx="1" fill={logoColor} />
          <rect x="11" y="16" width="2" height="4" rx="1" fill={logoColor} />
          <rect x="4" y="11" width="4" height="2" rx="1" fill={logoColor} />
          <rect x="16" y="11" width="4" height="2" rx="1" fill={logoColor} />
          
          <rect x="6.34" y="6.34" width="2" height="3" rx="1" fill={logoColor} transform="rotate(45 7.34 7.84)" />
          <rect x="15.66" y="15.66" width="2" height="3" rx="1" fill={logoColor} transform="rotate(45 16.66 17.16)" />
          <rect x="6.34" y="14.66" width="2" height="3" rx="1" fill={logoColor} transform="rotate(-45 7.34 16.16)" />
          <rect x="15.66" y="5.34" width="2" height="3" rx="1" fill={logoColor} transform="rotate(-45 16.66 6.84)" />
        </g>
      </svg>
    </div>
  )
}

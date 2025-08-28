import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to handle Supabase clock skew issues
export function handleSupabaseError(error: unknown): boolean {
  if (!error) return false
  
  const errorMessage = (error as Error).message || String(error)
  
  // Check for clock skew related errors
  if (errorMessage.includes('issued in the future') || 
      errorMessage.includes('clock skew') ||
      errorMessage.includes('token has expired')) {
    
    console.warn('Clock skew or token issue detected:', errorMessage)
    
    // For "issued in the future" errors during OAuth or page refresh, be lenient
    if (errorMessage.includes('issued in the future')) {
      // Don't clear auth data for minor clock skew - just log it
      console.warn('Minor clock skew detected, preserving session')
      return true
    }
    
    // Only clear data for definitively expired tokens, not refresh issues
    if (errorMessage.includes('token has expired') && 
        !errorMessage.includes('refresh')) {
      clearCorruptedAuthData()
    }
    
    return true // Indicates this was a clock skew error
  }
  
  return false // Not a clock skew error
}

// Clear corrupted auth data from localStorage
export function clearCorruptedAuthData(): void {
  if (typeof window === 'undefined') return
  
  try {
    const authKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase.auth') || key.includes('auth-token')
    )
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        console.warn('Failed to remove auth key:', key, e)
      }
    })
    // Auth data cleared
  } catch (error) {
    console.warn('Error clearing auth data:', error)
  }
}

// Minimal cleanup on app start - only clear OAuth flow flags
export function cleanupAuthDataOnStartup(): void {
  if (typeof window === 'undefined') return
  
  try {
    // ONLY clear OAuth flow flag on startup to prevent stuck states
    // DO NOT remove any auth tokens - let Supabase handle token validation
    sessionStorage.removeItem('oauth-flow-active');
    console.log('🔄 Cleared OAuth flow flag on startup')
  } catch (error) {
    console.warn('Error during minimal auth cleanup:', error)
  }
}

// Utility to check if the current time is reasonable
export function validateSystemTime(): { isValid: boolean; message?: string } {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Basic sanity check - year should be reasonable
  if (currentYear < 2020 || currentYear > 2030) {
    return {
      isValid: false,
      message: `System clock appears incorrect. Current year: ${currentYear}`
    }
  }
  
  return { isValid: true }
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
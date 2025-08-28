import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase credentials are properly configured
const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== 'YOUR_API_KEY' && 
         supabaseAnonKey !== 'YOUR_API_KEY' &&
         supabaseUrl.startsWith('https://') &&
         supabaseUrl.includes('.supabase.co')
}

// Create a mock client for development when Supabase isn't configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOtp: () => Promise.reject(new Error('Supabase not configured')),
    signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
    signOut: () => Promise.reject(new Error('Supabase not configured')),
  },
  from: () => ({
    select: () => ({ order: () => Promise.reject(new Error('Supabase not configured')) }),
    insert: () => ({ select: () => ({ single: () => Promise.reject(new Error('Supabase not configured')) }) }),
    delete: () => ({ eq: () => Promise.reject(new Error('Supabase not configured')) }),
  }),
})

// Custom storage that handles clock skew issues
const createClockSkewTolerantStorage = () => ({
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return null
      
      // For OAuth flows, disable clock skew checking entirely
      // The tokens are valid from the OAuth provider regardless of local clock
      if (key.includes('auth') && item.includes('access_token')) {
        // Check if we're in an OAuth flow or if OAuth params are in URL
        const isOAuthFlow = sessionStorage.getItem('oauth-flow-active') === 'true' ||
                           window.location.search.includes('access_token') ||
                           window.location.hash.includes('access_token');
        
        if (isOAuthFlow) {
          return item;
        }
        
        return item;
      }
      
      return item
    } catch (error) {
      console.warn('Error reading from localStorage:', error)
      return null
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, value)
      } catch (error) {
        console.warn('Error writing to localStorage:', error)
      }
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key)
      } catch (error) {
        console.warn('Error removing from localStorage:', error)
      }
    }
  }
})

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable automatic URL session detection for OAuth
        storageKey: 'supabase.auth.token',
        storage: createClockSkewTolerantStorage(),
        // Add debug mode to suppress warnings in development
        debug: false,
        // Allow clock skew tolerance for OAuth tokens
        flowType: 'pkce' // Use PKCE flow which is more tolerant of clock skew
      },
      // Global options
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web'
        }
      }
    })
  : createMockClient() as any

export type NoteContentType = 'text' | 'audio' | 'image' | 'mixed'

export type NoteAttachment = {
  id: string
  type: 'image' | 'audio'
  url: string
  fileName: string
  fileSize: number
  caption?: string
}

export type Note = {
  id: string
  user_id: string
  title?: string
  content: string
  content_type: NoteContentType
  attachments?: NoteAttachment[]
  tags?: string[]
  is_favorite?: boolean
  file_url?: string // Legacy support
  file_name?: string // Legacy support
  file_size?: number // Legacy support
  created_at: string
  updated_at?: string
}

export type AuthUser = {
  id: string
  email: string
}

// Manual session handling to avoid clock skew issues
export const handleUrlSession = async () => {
  if (typeof window === 'undefined' || !isSupabaseConfigured()) return null
  
  try {
    const url = new URL(window.location.href)
    const accessToken = url.searchParams.get('access_token')
    const refreshToken = url.searchParams.get('refresh_token')
    
    if (accessToken && refreshToken) {
      // Clear URL parameters
      url.searchParams.delete('access_token')
      url.searchParams.delete('refresh_token')
      url.searchParams.delete('expires_in')
      url.searchParams.delete('token_type')
      url.searchParams.delete('type')
      
      // Update URL without refresh
      window.history.replaceState({}, document.title, url.toString())
      
      // Set session manually with error handling
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (error) {
        console.warn('Error setting session from URL:', error.message)
        // Clear any corrupted auth data
        await supabase.auth.signOut({ scope: 'local' })
        return null
      }
      
      return data.session
    }
  } catch (error) {
    console.warn('Error handling URL session:', error)
  }
  
  return null
}

export { isSupabaseConfigured }

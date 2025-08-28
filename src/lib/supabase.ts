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

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
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

export { isSupabaseConfigured }

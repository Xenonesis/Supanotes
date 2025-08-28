import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  supabaseReady: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseReady = isSupabaseConfigured()

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabaseReady])

  const signInWithEmail = async (email: string) => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      throw new Error('Supabase not configured')
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      
      if (error) throw error
      toast.success('Check your email for the magic link!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send magic link')
      throw error
    }
  }

  const signInWithGoogle = async () => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      throw new Error('Supabase not configured')
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google')
      throw error
    }
  }

  const signOut = async () => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      throw new Error('Supabase not configured')
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    supabaseReady,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { handleSupabaseError, validateSystemTime } from '../lib/utils'
import { setOAuthFlowActive } from '../lib/oauthUtils'
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
  const supabaseReady = Boolean(isSupabaseConfigured())

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false)
      return
    }

    // Initialize authentication
    const initializeAuth = async () => {
      try {
        // Validate system time first
        const timeValidation = validateSystemTime()
        if (!timeValidation.isValid) {
          console.warn('System time validation failed:', timeValidation.message)
          toast.error('Please check your system clock and refresh the page')
        }

        // Get existing session - Supabase will automatically handle OAuth redirects
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          // Log the error but don't clear the session unless it's definitely expired
          console.warn('⚠️ Session retrieval error (preserving session):', error.message)
          
          // Only handle truly critical errors, not clock skew
          if (!error.message.includes('issued in the future') && 
              !error.message.includes('clock skew')) {
            const isClockSkewError = handleSupabaseError(error)
            if (!isClockSkewError) {
              console.error('❌ Critical session error:', error)
            }
          }
        }
        
        // Always set the user from the session if available
        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email)
          setUser(session.user)
        } else {
          console.log('ℹ️ No existing session found')
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        const isClockSkewError = handleSupabaseError(error)
        if (!isClockSkewError) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('🔐 Auth state change:', event, session?.user?.email || 'no user')
        
        // Handle INITIAL_SESSION - this happens on page refresh
        if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('✅ Restoring user session on page refresh:', session.user.email)
            setUser(session.user);
          } else {
            console.log('ℹ️ No existing session found on initial load')
            setUser(null);
          }
          setLoading(false);
          return;
        }
        
        // For OAuth flows, be more persistent about maintaining auth state
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in:', session.user.email)
          setUser(session.user);
          setLoading(false);
          
          // Mark OAuth flow as complete if we were in one
          if (sessionStorage.getItem('oauth-flow-active')) {
            sessionStorage.removeItem('oauth-flow-active');
            
            // Clean URL params
            const cleanUrl = new URL(window.location.href);
            cleanUrl.search = '';
            cleanUrl.hash = '';
            window.history.replaceState({}, document.title, cleanUrl.toString());
          }
          
          toast.success('Successfully signed in!');
          return; // Exit early to prevent further processing
        }
        
        // Handle token refresh - maintain user state
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed for:', session.user.email)
          setUser(session.user);
          setLoading(false);
          return;
        }
        
        // Only clear user state on explicit sign out
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out')
          setUser(null);
          setLoading(false);
          // Clear any OAuth flags on sign out
          sessionStorage.removeItem('oauth-flow-active');
          toast.success('Successfully signed out!');
          return;
        }
        
        // For any other events with a valid session, update user state
        if (session?.user) {
          console.log('🔄 Updating user state from session:', session.user.email)
          setUser(session.user);
        }
        
        setLoading(false);
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
      
      if (error) {
        // Handle clock skew errors during sign-in
        const isClockSkewError = handleSupabaseError(error)
        if (isClockSkewError) {
          toast.error('Authentication issue detected. Please refresh the page and try again.')
        }
        throw error
      }
      toast.success('Check your email for the magic link!')
    } catch (error) {
      const isClockSkewError = handleSupabaseError(error)
      if (!isClockSkewError) {
        toast.error((error as Error).message || 'Failed to send magic link')
      }
      throw error
    }
  }

  const signInWithGoogle = async () => {
    if (!supabaseReady) {
      toast.error('Please connect your Supabase project first')
      throw new Error('Supabase not configured')
    }

    try {
      // Mark OAuth flow as active to prevent token clearing
      sessionStorage.setItem('oauth-flow-active', 'true');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      
      if (error) {
        // Clear OAuth flag if sign-in failed
        sessionStorage.removeItem('oauth-flow-active');
        
        // Handle clock skew errors during OAuth sign-in
        const isClockSkewError = handleSupabaseError(error)
        if (isClockSkewError) {
          toast.error('Authentication issue detected. Please refresh the page and try again.')
        }
        throw error
      }
    } catch (error) {
      // Clear OAuth flag if sign-in failed
      sessionStorage.removeItem('oauth-flow-active');
      
      const isClockSkewError = handleSupabaseError(error)
      if (!isClockSkewError) {
        toast.error((error as Error).message || 'Failed to sign in with Google')
      }
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
    } catch (error) {
      toast.error((error as Error).message || 'Failed to sign out')
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

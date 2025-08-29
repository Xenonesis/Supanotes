import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { LandingPage } from './components/LandingPage'
import { DemoPreview } from './components/DemoPreview'
import { AuthPage } from './components/Auth/AuthPage'
import { EnhancedBasicDashboard } from './components/Dashboard/EnhancedBasicDashboard'
import { NotePreviewPage } from './components/Dashboard/NotePreviewPage'
import { LoadingSpinner } from './components/LoadingSpinner'
import DatabaseTestPage from './components/DatabaseTestPage'

import { OAuthHandler } from './components/OAuthHandler'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const { isDark } = useTheme()
  const [initializing, setInitializing] = useState(true)

  // Give extra time for auth initialization on page refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false)
    }, 1000) // Wait 1 second for auth to initialize properly

    return () => clearTimeout(timer)
  }, [])

  // Check if we're handling an OAuth redirect
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('access_token') || urlParams.get('code')) {
    return <OAuthHandler />
  }

  if (loading || initializing) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Routes>
        <Route path="/demo" element={<DemoPreview />} />
        <Route path="/database-test" element={<DatabaseTestPage />} />
        <Route path="/preview" element={user ? <NotePreviewPage /> : <LandingPage />} />
        <Route path="/auth/*" element={!user ? <AuthPage /> : <EnhancedBasicDashboard />} />
        <Route path="/dashboard" element={user ? <EnhancedBasicDashboard /> : <LandingPage />} />
        <Route path="/*" element={user ? <EnhancedBasicDashboard /> : <LandingPage />} />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: isDark 
              ? '0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
              : '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: isDark ? '#1f2937' : '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#1f2937' : '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: isDark ? '#1f2937' : '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}

function App() {
  // Only clear OAuth flow flags, never touch auth tokens on startup
  useEffect(() => {
    // Always just clear OAuth flow flag - let Supabase handle all token management
    sessionStorage.removeItem('oauth-flow-active');
    console.log('🔄 App started - cleared OAuth flow flag only')
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

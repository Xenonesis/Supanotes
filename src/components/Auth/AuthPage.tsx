import React from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent } from '../ui/Card'
import { Logo } from '../ui/Logo'
import { AlertCircle, Database, Shield, Zap } from 'lucide-react'

export const AuthPage: React.FC = () => {
  const { supabaseReady } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!supabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <Database className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Setup Required
            </h2>
            <p className="mt-2 text-gray-600">
              Connect your Supabase project to get started
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Configuration Steps
                  </h3>
                  <div className="mt-2 text-sm text-gray-700">
                    <ol className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">1</span>
                        <span>Connect your Supabase project</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">2</span>
                        <span>Set up database schema</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">3</span>
                        <span>Configure authentication</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isSignUp = location.pathname.includes('/signup')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <Logo size="xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">NoteMaster</h1>
          <h2 className="mt-2 text-lg text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isSignUp ? 'Sign up to start taking notes' : 'Sign in to access your notes'}
          </p>
        </div>

        {/* Features Banner */}
        {isSignUp && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <Shield className="h-5 w-5 mx-auto" />
                <p className="text-xs font-medium">Secure</p>
              </div>
              <div className="space-y-1">
                <Zap className="h-5 w-5 mx-auto" />
                <p className="text-xs font-medium">Fast</p>
              </div>
              <div className="space-y-1">
                <Database className="h-5 w-5 mx-auto" />
                <p className="text-xs font-medium">Synced</p>
              </div>
            </div>
          </div>
        )}

        {/* Auth Forms */}
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/*" element={<Navigate to="/auth/signin" replace />} />
        </Routes>

        {/* Toggle Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/auth/signin')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/auth/signup')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

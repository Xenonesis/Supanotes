import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { LogIn, Mail, Shield } from 'lucide-react'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const { signInWithEmail, signInWithGoogle } = useAuth()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      await signInWithEmail(email)
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      // Error handling is done in AuthContext
    }
  }

  return (
    <Card className="glass shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-gray-900 dark:text-gray-100">
          <LogIn className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Sign In</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            placeholder="Enter your email"
            disabled={loading}
            className="bg-white/60 dark:bg-gray-800/60"
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg"
            loading={loading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Magic Link
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full bg-white/60 dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">Secure Login</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                We'll send you a secure magic link to access your account. No password required!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

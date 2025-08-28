import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { LogOut, User } from 'lucide-react'

export const Header: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo size="lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">NoteMaster</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Secure note-taking made simple</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.full_name || 'User'}
              </span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>
          
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

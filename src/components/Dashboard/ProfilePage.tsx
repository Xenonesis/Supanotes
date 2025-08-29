import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { toast } from 'react-hot-toast'
import { User, Save, UserCircle, Home, Settings, Camera, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { uploadFile } from '../../lib/fileUpload'

export const ProfilePage: React.FC = () => {
  const { user, supabase } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
 const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    bio: '',
    phone: '',
    website: '',
    location: ''
  })

  // Timezone options
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney'
  ]

  // Gender options
  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ]

 // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || '',
        gender: user.user_metadata?.gender || '',
        timezone: user.user_metadata?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        bio: user.user_metadata?.bio || '',
        phone: user.user_metadata?.phone || '',
        website: user.user_metadata?.website || '',
        location: user.user_metadata?.location || ''
      })
      
      // Set avatar URL if it exists
      if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url)
      }
      
      setLoading(false)
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return

    try {
      setUploading(true)
      const file = event.target.files[0]
      
      // Validate file
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validImageTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      }
      
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB')
      }

      // Upload file
      const { url } = await uploadFile(file, user.id, 'profile')
      
      // Update user metadata with avatar URL
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: url
        }
      })

      if (error) throw error
      
      // Update local state
      setAvatarUrl(url)
      toast.success('Profile picture updated successfully!')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      // Provide more specific guidance for common errors
      const errorMessage = (error as Error).message || 'Failed to upload profile picture'
      if (errorMessage.includes('bucket')) {
        toast.error('Storage bucket not found. Please check SETUP_INSTRUCTIONS.md for detailed steps.')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeAvatar = async () => {
    if (!user) return

    try {
      setUploading(true)
      
      // Remove avatar URL from user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: null
        }
      })

      if (error) throw error
      
      // Update local state
      setAvatarUrl(null)
      toast.success('Profile picture removed successfully!')
    } catch (error) {
      console.error('Error removing avatar:', error)
      toast.error('Failed to remove profile picture')
    } finally {
      setUploading(false)
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          gender: formData.gender,
          timezone: formData.timezone,
          bio: formData.bio,
          phone: formData.phone,
          website: formData.website,
          location: formData.location,
          avatar_url: avatarUrl // Preserve avatar URL
        }
      })

      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <Card className="glass interactive-lift animate-fade-in-left">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                <span>Account</span>
              </h2>
              <nav className="space-y-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 interactive-glow"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 transition-all duration-20 interactive-glow shadow-sm"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-20 interactive-glow"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </nav>
              
              {/* User Info Card */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <Card className="glass interactive-lift animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Profile Picture</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={uploadAvatar}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => fileInputRef.current?.click()}
                        loading={uploading}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Upload New
                      </Button>
                      {avatarUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={removeAvatar}
                          loading={uploading}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Personal Information</h3>
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      icon={<UserCircle className="h-4 w-4" />}
                      className="glass"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      icon={<UserCircle className="h-4 w-4" />}
                      className="glass bg-gray-10 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleSelectChange('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white glass"
                      >
                        <option value="">Select gender</option>
                        {genders.map((gender) => (
                          <option key={gender.value} value={gender.value}>
                            {gender.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => handleSelectChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white glass"
                      >
                        <option value="">Select timezone</option>
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Additional Fields */}
                  <div className="space-y-4 pt-4">
                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white glass min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="glass"
                        />
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Website
                        </label>
                        <Input
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                          className="glass"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="glass"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    loading={saving}
                    icon={<Save className="h-4 w-4" />}
                    className="interactive-glow"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

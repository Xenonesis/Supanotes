import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PenTool, 
  Shield, 
  Zap, 
  Search, 
  Download, 
  Upload, 
  Smartphone, 
  Globe, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Clock, 
  FileText,
  Sparkles,
  BookOpen,
  Lock,
  RefreshCw,
  Palette,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { Logo } from './ui/Logo'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { ThemeToggleIcon } from './ui/ThemeToggle'
import { HeroGeometric } from './ui/shape-landing-hero'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: PenTool,
      title: "Rich Text Editor",
      description: "Write with style using our advanced rich text editor with formatting, lists, and more.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find any note instantly with our powerful search and filtering capabilities.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your notes are encrypted and stored securely with enterprise-grade protection.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: RefreshCw,
      title: "Real-time Sync",
      description: "Access your notes anywhere, anytime with seamless cloud synchronization.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Palette,
      title: "Beautiful Themes",
      description: "Choose from light, dark, or system themes that adapt to your preferences.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Download,
      title: "Export & Import",
      description: "Backup your notes or migrate from other apps with flexible export options.",
      color: "from-teal-500 to-cyan-500"
    }
  ]

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Notes Created", icon: FileText },
    { number: "99.9%", label: "Uptime", icon: Clock },
    { number: "4.9★", label: "User Rating", icon: Star }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation - Overlay on hero */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="lg" className="animate-pulse" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              NoteMaster
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggleIcon />
            <Button
              onClick={() => navigate('/auth/signin')}
              variant="outline"
              className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/auth/signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroGeometric
        badge="The future of note-taking is here"
        title1="Your Ideas,"
        title2="Beautifully Organized"
        onGetStarted={() => navigate('/auth/signup')}
        onViewDemo={() => navigate('/demo')}
      />

      {/* Stats Section */}
      <section className="relative px-6 py-16 bg-gradient-to-r from-white/80 via-blue-50/80 to-indigo-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-y border-white/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl mb-4 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20 gradient-bg-animated">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to capture, organize, and access your thoughts seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`glass hover:glass-strong transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group ${
                  activeFeature === index ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Get started in minutes with our simple, intuitive workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your account with just an email. No complex setup required.",
                icon: Users,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "Start Writing",
                description: "Use our rich text editor to create beautiful, formatted notes instantly.",
                icon: PenTool,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Stay Organized",
                description: "Search, filter, and organize your notes with powerful tools and features.",
                icon: Search,
                color: "from-green-500 to-emerald-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl text-white shadow-xl shadow-blue-500/20 group-hover:shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-white to-blue-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-slate-700 dark:text-white shadow-lg border border-blue-100 dark:border-gray-700">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-slate-900 to-blue-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Note-Taking?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of users who have already discovered the power of organized thinking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              onClick={() => navigate('/auth/signup')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            
            <div className="flex items-center space-x-2 text-white/80">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Logo size="md" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">NoteMaster</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-200">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Available Worldwide</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800/30 mt-8 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; 2024 NoteMaster. All rights reserved. Built with ❤️ for better note-taking.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
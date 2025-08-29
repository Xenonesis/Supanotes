import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PenTool, 
  Shield, 
  Zap, 
  Search, 
  Download, 
  Globe, 
  Star, 
  ArrowRight, 
  Users, 
  Clock, 
  FileText,
 Sparkles,
  Lock,
  RefreshCw,
  Palette,
  Menu,
  X
} from 'lucide-react'
import { Logo } from './ui/Logo'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { ThemeToggleIcon } from './ui/ThemeToggle'
import { HeroGeometric } from './ui/shape-landing-hero'
import { MarqueeDemo } from './ui/marquee-demo'
import DatabaseWithRestApi from './ui/database-with-rest-api'
import { useTheme } from '../contexts/ThemeContext'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className={`min-h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Navigation - Fixed at top */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="lg" className="animate-pulse" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              NoteMaster
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggleIcon />
            <Button
              onClick={() => navigate('/auth/signin')}
              variant="outline"
              className={`${
                isDark 
                  ? 'bg-gray-800/90 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:text-white' 
                  : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:text-gray-900'
              } backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md`}
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
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggleIcon />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-primary-500 dark:focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 animate-fade-in-up">
            <div className="glass rounded-2xl p-4 space-y-4 shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    navigate('/auth/signin')
                    setMobileMenuOpen(false)
                  }}
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    navigate('/auth/signup')
                    setMobileMenuOpen(false)
                  }}
                  size="md"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-20">
        <HeroGeometric
          badge="The future of note-taking is here"
          title1="Your Ideas,"
          title2="Beautifully Organized"
          onGetStarted={() => navigate('/auth/signup')}
          onViewDemo={() => navigate('/demo')}
        />
      </div>

      {/* Stats Section */}
      <section className={`relative px-6 py-16 ${
        isDark 
          ? 'bg-gray-900/50 backdrop-blur-sm border-y border-gray-700/20' 
          : 'bg-gradient-to-r from-white/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-y border-white/20'
      }`}>
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
                <div className={`text-3xl font-bold mb-1 ${
                  isDark 
                    ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent'
                }`}>
                  {stat.number}
                </div>
                <div className={isDark ? "text-gray-400 text-sm font-medium" : "text-gray-600 text-sm font-medium"}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`relative px-6 py-20 overflow-hidden ${isDark ? 'bg-gray-900' : 'gradient-bg-animated'}`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, ${isDark ? '#3b82f6' : '#60a5fa'} 0%, transparent 20%), 
                              radial-gradient(circle at 85% 30%, ${isDark ? '#8b5cf6' : '#a78bfa'} 0%, transparent 20%)`,
            backgroundSize: '1000px 600px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 text-white shadow-lg shadow-blue-500/30 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark 
                ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
            }`}>
              Powerful Features
            </h2>
            <p className={isDark ? "text-xl text-gray-400 max-w-2xl mx-auto" : "text-xl text-gray-600 max-w-2xl mx-auto"}>
              Everything you need to capture, organize, and access your thoughts seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass hover:glass-strong transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group relative ${
                  activeFeature === index ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/30' : 'shadow-lg'
                } ${isDark ? 'dark:bg-gray-800/50' : ''}`}
                onClick={() => setActiveFeature(index)}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'none' : 'translateY(20px)'
                }}
              >
                <Card className="h-full">
                  {/* Feature highlight glow */}
                  {activeFeature === index && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl -z-10 animate-pulse-slow"></div>
                  )}
                  
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 relative overflow-hidden`}>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <feature.icon className="w-8 h-8 relative z-10" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                      activeFeature === index 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={isDark ? "text-gray-40 leading-relaxed" : "text-gray-600 leading-relaxed"}>
                      {feature.description}
                    </p>
                    
                    {/* Subtle hover indicator */}
                    <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REST API Architecture Section */}
      <section className={`relative px-6 py-20 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark 
                ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
            }`}>
              Built on Modern Architecture
            </h2>
            <p className={isDark ? "text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed" : "text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"}>
              NoteMaster leverages a robust REST API architecture with real-time synchronization, 
              ensuring your notes are always secure, fast, and accessible across all your devices.
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <DatabaseWithRestApi 
              title="NoteMaster REST API - Secure & Scalable"
              circleText="API"
              lightColor={isDark ? "#60a5fa" : "#3b82f6"}
              badgeTexts={{
                first: "NOTES",
                second: "AUTH", 
                third: "SYNC",
                fourth: "SECURE"
              }}
              buttonTexts={{
                first: "NoteMaster",
                second: "production"
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "End-to-end encryption with secure authentication and authorization protocols.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized API endpoints with caching and CDN delivery for instant response times.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: RefreshCw,
                title: "Real-time Sync",
                description: "Seamless synchronization across all devices with conflict resolution and offline support.",
                color: "from-blue-500 to-purple-500"
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className={`glass hover:glass-strong transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  isDark ? 'dark:bg-gray-800/50' : ''
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl mb-4 text-white shadow-lg`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className={isDark ? "text-lg font-semibold mb-3 text-white" : "text-lg font-semibold mb-3 text-gray-900"}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? "text-gray-400 text-sm leading-relaxed" : "text-gray-600 text-sm leading-relaxed"}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Marquee */}
      <section className={`w-full py-12 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
          : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={isDark ? "text-3xl font-bold text-gray-100 mb-4" : "text-3xl font-bold text-gray-900 mb-4"}>
              Technology Stack
            </h2>
            <p className={isDark ? "text-lg text-gray-400 max-w-2xl mx-auto" : "text-lg text-gray-600 max-w-2xl mx-auto"}>
              Built with modern technologies and frameworks for optimal performance and developer experience.
            </p>
          </div>
          <MarqueeDemo />
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative px-6 py-12 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white' 
          : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
      }`}>
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
          
          <div className={`border-t mt-8 pt-8 text-center text-sm ${
            isDark ? 'border-blue-800/30 text-blue-200' : 'border-blue-800/30 text-blue-200'
          }`}>
            <p>&copy; 2024 NoteMaster. All rights reserved. Built with ❤️ for better note-taking.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

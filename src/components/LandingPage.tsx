import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeroGeometric } from './ui/shape-landing-hero'
import { useTheme } from '../contexts/ThemeContext'
import { Navigation } from './landing/Navigation'
import { StatsSection } from './landing/StatsSection'
import { FeaturesSection } from './landing/FeaturesSection'
import { RestApiSection } from './landing/RestApiSection'
import { TechnologyStackSection } from './landing/TechnologyStackSection'
import { Footer } from './landing/Footer'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrolled, setScrolled] = useState(false)

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

  return (
    <div className={`min-h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Navigation - Fixed at top */}
      <Navigation scrolled={scrolled} />

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
      <StatsSection isVisible={isVisible} />

      {/* Features Section */}
      <FeaturesSection 
        activeFeature={activeFeature} 
        setActiveFeature={setActiveFeature}
        isVisible={isVisible}
      />

      {/* REST API Architecture Section */}
      <RestApiSection isDark={isDark} />

      {/* Technology Stack Marquee */}
      <TechnologyStackSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

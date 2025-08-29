import React from 'react'
import { MarqueeDemo } from '../ui/marquee-demo'
import { useTheme } from '../../contexts/ThemeContext'

export const TechnologyStackSection: React.FC = () => {
  const { isDark } = useTheme()
  
  return (
    <section className={`w-full py-12 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0C0C0C] via-gray-900 to-black' 
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
  )
}

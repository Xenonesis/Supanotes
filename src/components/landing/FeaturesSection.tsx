import React from 'react'
import { 
  PenTool, 
  Shield, 
  Search, 
  Download, 
  ArrowRight, 
 Sparkles,
  RefreshCw,
  Palette
} from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { useTheme } from '../../contexts/ThemeContext'

interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
}

interface FeaturesSectionProps {
  activeFeature: number;
  setActiveFeature: (index: number) => void;
  isVisible: boolean;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  activeFeature, 
  setActiveFeature,
  isVisible 
}) => {
  const { isDark } = useTheme()
  
  const features: Feature[] = [
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
      color: "from-orange-50 to-red-500"
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

  return (
    <section className={`relative px-6 py-20 overflow-hidden ${isDark ? 'bg-[#0C0C0C]' : 'gradient-bg-animated'}`}>
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
  )
}

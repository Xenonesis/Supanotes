import React from 'react'
import { Users, FileText, Clock, Star } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface StatItem {
  number: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface StatsSectionProps {
  isVisible: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ isVisible }) => {
  const { isDark } = useTheme()
  
  const stats: StatItem[] = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Notes Created", icon: FileText },
    { number: "99.9%", label: "Uptime", icon: Clock },
    { number: "4.9★", label: "User Rating", icon: Star }
  ]

  return (
    <section className={`relative px-6 py-16 ${
      isDark 
        ? 'bg-[#0C0C0C]/50 backdrop-blur-sm border-y border-gray-700/20' 
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
  )
}

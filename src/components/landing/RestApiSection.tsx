import React from 'react'
import { Shield, Zap, RefreshCw } from 'lucide-react'
import DatabaseWithRestApi from '../ui/database-with-rest-api'
import { Card, CardContent } from '../ui/Card'

interface RestApiSectionProps {
  isDark: boolean;
}

export const RestApiSection: React.FC<RestApiSectionProps> = ({ isDark }) => {
  return (
    <section className={`relative px-6 py-20 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0C0C0C] via-gray-800 to-[#0C0C0C]' 
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
              color: "from-yellow-500 to-orange-50"
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
  )
}

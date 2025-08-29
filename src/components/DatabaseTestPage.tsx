import React from 'react';
import DatabaseWithRestApi from './ui/database-with-rest-api';

const DatabaseTestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Database REST API Component Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Testing the new Database REST API component integration
          </p>
        </div>

        {/* Basic Component */}
        <div className="glass p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Default Configuration
          </h2>
          <div className="flex justify-center">
            <DatabaseWithRestApi />
          </div>
        </div>

        {/* Customized Component */}
        <div className="glass p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Customized for Your Note-Taking App
          </h2>
          <div className="flex justify-center">
            <DatabaseWithRestApi 
              title="Supabase REST API Integration"
              circleText="API"
              lightColor="#3b82f6"
              badgeTexts={{
                first: "NOTES",
                second: "AUTH", 
                third: "FILES",
                fourth: "SYNC"
              }}
              buttonTexts={{
                first: "NoteMaster",
                second: "v2_updates"
              }}
            />
          </div>
        </div>

        {/* Another Variation */}
        <div className="glass p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Custom Branding
          </h2>
          <div className="flex justify-center">
            <DatabaseWithRestApi 
              title="Real-time Data Synchronization"
              circleText="DB"
              lightColor="#10b981"
              badgeTexts={{
                first: "CREATE",
                second: "READ", 
                third: "UPDATE",
                fourth: "DELETE"
              }}
              buttonTexts={{
                first: "YourApp",
                second: "production"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestPage;
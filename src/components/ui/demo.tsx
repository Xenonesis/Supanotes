"use client";

import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

export const DatabaseApiDemo = () => {
  return (
    <div className="p-4 rounded-xl bg-accent/20 w-full">
      <DatabaseWithRestApi />
    </div>
  );
};

export const CustomDatabaseApiDemo = () => {
  return (
    <div className="p-8 rounded-xl glass w-full">
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
          first: "YourApp",
          second: "v3_release"
        }}
      />
    </div>
  );
};
import { useTheme } from "../contexts/ThemeContext";

// Utility function to get theme-based classes for consistent styling
export const getThemeClasses = (isDark: boolean) => {
  return {
    // Background classes
    bg: {
      primary: isDark ? 'bg-gray-900' : 'bg-white',
      secondary: isDark ? 'bg-gray-800' : 'bg-gray-100',
      accent: isDark ? 'bg-gray-700' : 'bg-gray-200',
      gradient: isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-white to-gray-100'
    },
    
    // Text classes
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-700',
      muted: isDark ? 'text-gray-500' : 'text-gray-500',
      inverted: isDark ? 'text-gray-900' : 'text-white'
    },
    
    // Border classes
    border: {
      primary: isDark ? 'border-gray-700' : 'border-gray-300',
      secondary: isDark ? 'border-gray-600' : 'border-gray-200'
    },
    
    // Shadow classes
    shadow: {
      light: isDark 
        ? 'shadow-[0_10px_25px_-3px_rgba(0,0,0,0.3),0_4px_6px_-2px_rgba(0,0,0,0.2)]' 
        : 'shadow-[0_10px_25px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]',
      medium: isDark 
        ? 'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)]' 
        : 'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.05)]'
    }
  };
};

// Hook to get theme-based colors for SVGs and other elements
export const useThemeColors = () => {
  const { isDark } = useTheme();
  
  return {
    // Text colors
    textPrimary: isDark ? '#ffffff' : '#111827',
    textSecondary: isDark ? '#d1d5db' : '#374151',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    
    // Background colors
    bgPrimary: isDark ? '#111827' : '#ffffff',
    bgSecondary: isDark ? '#1f2937' : '#f9fafb',
    bgAccent: isDark ? '#374151' : '#f3f4f6',
    
    // Accent colors
    accentBlue: isDark ? '#60a5fa' : '#3b82f6',
    accentGreen: isDark ? '#34d399' : '#10b981',
    accentPurple: isDark ? '#a78bfa' : '#8b5cf6',
    
    // Border colors
    borderPrimary: isDark ? '#374151' : '#e5e7eb',
    borderSecondary: isDark ? '#1f2937' : '#f3f4f6'
  };
};

// Type for theme-aware components
export type ThemeAwareProps = {
  isDark?: boolean;
};

export default useTheme;
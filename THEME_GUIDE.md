# Theme Guide for NoteMaster

This guide explains how theming works in the NoteMaster application and how to maintain consistency across components.

## Theme System Overview

The application uses a custom theme context (`ThemeContext.tsx`) that provides:

1. **Theme State Management** - Tracks current theme (light, dark, system)
2. **System Preference Detection** - Automatically adapts to OS theme
3. **Persistent Storage** - Saves user preference in localStorage
4. **Real-time Updates** - Components re-render when theme changes

## Using the Theme Context

### In Components

```tsx
import { useTheme } from '../contexts/ThemeContext'

const MyComponent = () => {
  const { isDark, theme, setTheme } = useTheme()
  
  return (
    <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      {/* Component content */}
    </div>
  )
}
```

### Theme-Aware Styling

Components should use conditional classes based on the `isDark` value:

```tsx
// Good - Conditional classes
<div className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>

// Better - Utility classes
<div className={cn(
  'transition-colors duration-200',
  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
)}>

// Best - Predefined theme classes
<div className={cn(
  'bg-theme-bg text-theme-text',
  'transition-colors duration-200'
)}>
```

## Color Palette

### Light Theme
- Background: `#ffffff` (white)
- Surface: `#f9fafb` (gray-50)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#374151` (gray-700)
- Text Muted: `#6b7280` (gray-500)
- Borders: `#e5e7eb` (gray-200)

### Dark Theme
- Background: `#111827` (gray-900)
- Surface: `#1f2937` (gray-800)
- Text Primary: `#ffffff` (white)
- Text Secondary: `#d1d5db` (gray-300)
- Text Muted: `#9ca3af` (gray-400)
- Borders: `#374151` (gray-700)

## Component Theming Guidelines

### 1. Buttons
Use the `Button` component with appropriate variants:
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
```

The Button component automatically adapts to the current theme.

### 2. Cards
Use the `Card` component with appropriate variants:
```tsx
<Card variant="default">
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### 3. Inputs
Use the `Input` component:
```tsx
<Input 
  label="Email"
  placeholder="Enter your email"
  variant="default"
/>
```

### 4. Text
Always consider readability:
- Use appropriate contrast ratios
- Adjust font weights for different themes
- Consider using gradients for headings

## Best Practices

### 1. Consistent Transitions
Always use transitions for theme changes:
```css
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

### 2. System Preference Respect
Respect user's system preferences:
```tsx
useEffect(() => {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(prefersDark)
  }
}, [theme])
```

### 3. SVG Icons
Make SVG icons theme-aware:
```tsx
<svg className={isDark ? 'text-gray-100' : 'text-gray-900'}>
  <path fill="currentColor" d="..." />
</svg>
```

### 4. Images
Consider using different images for light/dark themes when appropriate:
```tsx
<img 
  src={isDark ? '/logo-dark.svg' : '/logo-light.svg'} 
  alt="Logo"
/>
```

## Utility Functions

The project includes theme utility functions in `src/utils/theme-utils.ts`:

### getThemeClasses
Returns consistent theme-based classes:
```tsx
import { getThemeClasses } from '../utils/theme-utils'

const { bg, text, border } = getThemeClasses(isDark)
```

### useThemeColors
Returns theme-based color values:
```tsx
import { useThemeColors } from '../utils/theme-utils'

const colors = useThemeColors()
// colors.textPrimary, colors.bgPrimary, etc.
```

## Testing Theme Changes

1. **Manual Testing**: Toggle themes using the theme switcher
2. **System Theme**: Change OS theme to verify system preference detection
3. **Contrast Checking**: Ensure text remains readable in both themes
4. **Visual Consistency**: Check that all components render correctly

## Common Issues

### 1. Flash of Incorrect Theme
Solution: Set initial theme in `index.html` or use SSR

### 2. Inconsistent Colors
Solution: Use predefined color variables and utility classes

### 3. Poor Contrast
Solution: Test with accessibility tools and adjust accordingly

## Future Improvements

1. **Custom Themes**: Allow users to define custom color schemes
2. **Theme Animations**: Add smooth transitions between theme changes
3. **High Contrast Mode**: Add accessibility-focused theme options
4. **Reduced Motion**: Respect user's motion preferences

This guide should help maintain consistency and usability across all themes in the application.
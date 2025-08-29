import { useState, useEffect } from 'react'

export type Layout = 'grid' | 'list' | 'masonry' | 'compact'
export type ColorScheme = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo'

export const useLayoutPreferences = () => {
  const [layout, setLayout] = useState<Layout>(() => {
    const saved = localStorage.getItem('layout')
    return (saved as Layout) || 'grid'
  })
  
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem('colorScheme')
    return (saved as ColorScheme) || 'blue'
  })

  useEffect(() => {
    localStorage.setItem('layout', layout)
  }, [layout])

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme)
    document.documentElement.setAttribute('data-color-scheme', colorScheme)
  }, [colorScheme])

  return {
    layout,
    setLayout,
    colorScheme,
    setColorScheme,
  }
}
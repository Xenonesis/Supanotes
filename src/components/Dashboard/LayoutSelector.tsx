import React from 'react'
import { Button } from '../ui/Button'
import { Grid3X3, List, Columns, MoreHorizontal } from 'lucide-react'
import { useTheme, Layout } from '../../contexts/ThemeContext'

export const LayoutSelector: React.FC = () => {
  const { layout, setLayout } = useTheme()

  const layouts: { key: Layout; icon: React.ReactNode; label: string }[] = [
    { key: 'grid', icon: <Grid3X3 className="h-4 w-4" />, label: 'Grid' },
    { key: 'list', icon: <List className="h-4 w-4" />, label: 'List' },
    { key: 'masonry', icon: <Columns className="h-4 w-4" />, label: 'Masonry' },
    { key: 'compact', icon: <MoreHorizontal className="h-4 w-4" />, label: 'Compact' },
  ]

  return (
    <div className="flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 p-1 rounded-lg shadow-sm">
      {layouts.map(({ key, icon, label }) => (
        <Button
          key={key}
          variant={layout === key ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setLayout(key)}
          className="h-8 px-3"
          title={label}
        >
          {icon}
          <span className="ml-1 hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Grid, List, Table, Search, Filter, SortAsc } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewType = 'card' | 'list' | 'table'

interface ViewToolbarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
  showSearch?: boolean
  showFilter?: boolean
  showSort?: boolean
  className?: string
}

export function ViewToolbar({
  currentView,
  onViewChange,
  searchTerm = '',
  onSearchChange,
  showSearch = true,
  showFilter = true,
  showSort = true,
  className
}: ViewToolbarProps) {
  const viewOptions = [
    { value: 'card' as ViewType, icon: Grid, label: 'Card View' },
    { value: 'list' as ViewType, icon: List, label: 'List View' },
    { value: 'table' as ViewType, icon: Table, label: 'Table View' }
  ]

  return (
    <Card variant="glass" className={cn("p-4 glass-card", className)}>
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        {showSearch && onSearchChange && (
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-accent-purple/30 focus:border-accent-purple focus:outline-none transition-all duration-200 bg-background text-foreground"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Filter & Sort */}
          {showFilter && (
            <Button variant="glass" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}
          
          {showSort && (
            <Button variant="glass" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          )}

          {/* View Toggle */}
          <div className="flex items-center border-2 border-accent-purple/30 rounded-lg p-1 bg-card">
            {viewOptions.map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={currentView === value ? "purple" : "ghost"}
                size="sm"
                onClick={() => onViewChange(value)}
                className={cn(
                  "transition-all duration-200 transform-gpu",
                  currentView === value 
                    ? "shadow-lg" 
                    : "hover:bg-accent-purple/10"
                )}
                style={{
                  transform: currentView === value ? 'translateY(-1px) scale(1.02)' : undefined,
                  willChange: 'transform',
                }}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
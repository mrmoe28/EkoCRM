'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Calendar,
  Zap
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
              <Zap className="h-6 w-6 text-primary transition-transform" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EkoSolar CRM
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-all duration-200",
                      isActive ? "scale-110" : ""
                    )} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Calendar,
  Zap,
  Menu,
  X
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
]

function MobileNavItem({ item, pathname, onClick }: { item: any, pathname: string, onClick: () => void }) {
  const Icon = item.icon
  const isActive = pathname === item.href
  
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground shadow-lg'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
      )}
    >
      <Icon className="h-5 w-5" />
      {item.name}
    </Link>
  )
}

function BottomNavItem({ item, pathname }: { item: any, pathname: string }) {
  const Icon = item.icon
  const isActive = pathname === item.href
  
  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-all duration-200 min-h-[4rem]',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className={cn(
        'h-5 w-5 mb-1 transition-all duration-200',
        isActive && 'scale-110'
      )} />
      <span className="truncate">{item.name}</span>
    </Link>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="glass-nav sticky top-0 z-50 hidden sm:block">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4 lg:gap-8">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg lg:text-xl group">
                <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-primary transition-transform" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EkoSolar CRM
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg transform-gpu'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/10 hover:shadow-md'
                      )}
                      style={{
                        transform: isActive ? 'translateY(-1px) scale(1.02)' : undefined,
                        willChange: 'transform',
                      }}
                    >
                      <Icon 
                        className="h-4 w-4 transition-all duration-200"
                        style={{
                          transform: isActive ? 'scale(1.1)' : undefined,
                          willChange: 'transform',
                        }}
                      />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              <ThemeToggle />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="glass-nav sticky top-0 z-50 sm:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EkoSolar
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 px-0">
                <SheetHeader className="px-6 pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    EkoSolar CRM
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 space-y-2">
                  {navigation.map((item) => (
                    <MobileNavItem 
                      key={item.name} 
                      item={item} 
                      pathname={pathname}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
                <div className="px-6 pt-6 border-t mt-6">
                  <ProfileDropdown />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navigation.map((item) => (
            <BottomNavItem 
              key={item.name} 
              item={item} 
              pathname={pathname}
            />
          ))}
        </div>
      </div>
    </>
  )
}
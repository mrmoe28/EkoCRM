'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'

const authPages = ['/login', '/signup', '/forgot-password', '/reset-password']

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  // Check if current page is an auth page
  const isAuthPage = authPages.some(page => pathname.startsWith(page))
  
  // Don't show navigation on auth pages or when user is not authenticated
  const showNavigation = !isAuthPage && user && !isLoading

  if (isAuthPage) {
    // Auth pages get full screen layout without navigation
    return (
      <div className="min-h-screen bg-background theme-transition">
        {children}
      </div>
    )
  }

  if (isLoading) {
    // Show loading state
    return (
      <div className="min-h-screen bg-background theme-transition flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    // User not authenticated, redirect handled by middleware
    return (
      <div className="min-h-screen bg-background theme-transition">
        {children}
      </div>
    )
  }

  // Authenticated user gets full layout with navigation
  return (
    <div className="min-h-screen bg-background theme-transition">
      {showNavigation && <Navigation />}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
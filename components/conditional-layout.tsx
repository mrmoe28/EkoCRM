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

  if (isLoading && !isAuthPage) {
    // Show loading state only for protected pages
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
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-6">
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
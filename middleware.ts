import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup', 
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password'
]

// Paths that require authentication
const protectedPaths = [
  '/',
  '/contacts',
  '/jobs',
  '/tasks',
  '/schedule',
  '/themes',
  '/profile',
  '/api/contacts',
  '/api/jobs',
  '/api/tasks',
  '/api/auth/session',
  '/api/auth/logout',
  '/api/auth/update-profile'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value
  
  // Debug logging
  console.log(`🔍 [Middleware] Request to: ${pathname}`)
  console.log(`🍪 [Middleware] Has token: ${!!token}`)
  
  // Single token verification for performance
  let userPayload: any = null
  if (token) {
    try {
      userPayload = verifyToken(token)
      console.log(`✅ [Middleware] Token valid for user: ${userPayload?.email}`)
    } catch (error) {
      console.error('❌ [Middleware] Token verification failed:', error)
    }
  }
  
  const isAuthenticated = !!userPayload
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    console.log(`🔄 [Middleware] Redirecting authenticated user from ${pathname} to dashboard`)
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow all public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Allow static files and API routes not in protected list
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') && !protectedPaths.some(path => pathname.startsWith(path)) ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Check authentication for protected paths
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token || !userPayload) {
      console.log(`🚫 [Middleware] Unauthenticated access to protected route: ${pathname}`)
      // Redirect to login for protected routes
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      
      // Clear invalid token if present
      if (token && !userPayload) {
        console.log(`🗑️ [Middleware] Clearing invalid token`)
        response.cookies.delete('auth-token')
      }
      
      return response
    }
    
    // Add user info to headers for API routes
    const response = NextResponse.next()
    response.headers.set('x-user-id', userPayload.userId)
    response.headers.set('x-user-email', userPayload.email)
    response.headers.set('x-user-name', userPayload.name)
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
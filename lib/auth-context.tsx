'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/db'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isRedirecting: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        console.log('✅ Session validated for user:', data.user.email)
      } else if (response.status === 401) {
        // Unauthorized - clear any stale auth state
        setUser(null)
        console.log('🔒 Session expired or invalid')
      } else {
        setUser(null)
        console.error('❌ Session check failed with status:', response.status)
      }
    } catch (error) {
      console.error('❌ Session check network error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process for:', email)
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('❌ Login failed:', data.error)
      throw new Error(data.error || 'Login failed')
    }

    const data = await response.json()
    console.log('✅ Login API successful, setting user state')
    setUser(data.user)
    
    // Wait for state update and cookie to be set
    await new Promise(resolve => setTimeout(resolve, 200))
    
    console.log('🍪 Waiting for cookie synchronization...')
    
    // Verify cookie is set before redirect
    const checkCookie = () => {
      const hasCookie = document.cookie.includes('auth-token')
      console.log('🔍 Cookie check:', hasCookie ? 'Found' : 'Not found')
      return hasCookie
    }
    
    // Retry mechanism for cookie verification
    let retries = 0
    const maxRetries = 5
    
    while (!checkCookie() && retries < maxRetries) {
      console.log(`⏳ Waiting for cookie... (attempt ${retries + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, 100))
      retries++
    }
    
    if (!checkCookie()) {
      console.error('❌ Cookie not set after login, attempting fallback redirect')
    }
    
    console.log('🔄 Redirecting to dashboard using router...')
    setIsRedirecting(true)
    
    // Use router navigation instead of window.location
    router.push('/')
    
    // Fallback redirect if router.push doesn't work
    setTimeout(() => {
      if (window.location.pathname === '/login') {
        console.log('⚠️ Router redirect failed, using fallback window.location')
        window.location.href = '/'
      } else {
        setIsRedirecting(false)
      }
    }, 1000)
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error)
    } finally {
      setUser(null)
      console.log('🔄 Redirecting to login...')
      router.push('/login')
    }
  }

  const refresh = async () => {
    await checkSession()
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('❌ Profile update failed:', data.error)
        throw new Error(data.error || 'Profile update failed')
      }

      const data = await response.json()
      setUser(data.user)
      console.log('✅ Profile updated successfully for user:', data.user.email)
    } catch (error) {
      console.error('❌ Profile update error:', error)
      throw error
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isRedirecting, login, logout, refresh, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
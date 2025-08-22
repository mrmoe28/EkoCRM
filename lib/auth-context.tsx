'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/db'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }

    const data = await response.json()
    setUser(data.user)
    console.log('✅ Login successful for user:', data.user.email)
    
    // Handle redirect after state update
    setTimeout(() => {
      console.log('🔄 Redirecting to dashboard...')
      window.location.href = '/'
    }, 100)
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
      window.location.href = '/login'
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh, updateUser }}>
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
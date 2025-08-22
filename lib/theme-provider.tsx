'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="ekosolarpros-theme"
    >
      {children}
    </NextThemesProvider>
  )
}

// Simple hook that wraps next-themes
export const useExtendedTheme = () => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme()
  
  return {
    mode: theme as 'light' | 'dark' | 'system',
    setMode: setTheme,
    systemTheme,
    resolvedTheme
  }
}
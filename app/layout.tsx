import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConditionalLayout } from '@/components/conditional-layout'
import { ThemeProvider } from '@/lib/theme-provider'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EkoSolar CRM',
  description: 'Solar project management and customer relationship management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
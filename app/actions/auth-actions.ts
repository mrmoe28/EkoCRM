'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function redirectToDashboard() {
  // Server-side redirect that bypasses client-side router issues
  redirect('/')
}

export async function redirectToLogin() {
  // Server-side redirect to login
  redirect('/login')
}

export async function checkAuthAndRedirect() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (token) {
    redirect('/')
  } else {
    redirect('/login')
  }
}
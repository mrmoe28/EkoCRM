import { NextRequest, NextResponse } from 'next/server'
import { db, users, passwordResetTokens } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { generateResetToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in database
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token: resetToken,
      expiresAt
    })

    // In a real application, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
      // In development, include the token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
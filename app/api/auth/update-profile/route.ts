import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verifyToken } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userPayload = verifyToken(token)
    if (!userPayload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const updateData = await request.json()
    
    // Remove sensitive fields that shouldn't be updated this way
    const { id, password, createdAt, updatedAt, ...safeUpdateData } = updateData

    // Update user in database
    const [updatedUser] = await db
      .update(users)
      .set({
        ...safeUpdateData,
        updatedAt: new Date()
      })
      .where(eq(users.id, userPayload.userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        state: users.state,
        zipCode: users.zipCode,
        company: users.company,
        profileImage: users.profileImage,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
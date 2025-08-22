import { NextRequest, NextResponse } from 'next/server'
import { db, contacts, Contact, NewContact } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET all contacts
export async function GET() {
  try {
    const allContacts = await db.select().from(contacts).orderBy(contacts.createdAt)
    return NextResponse.json(allContacts)
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newContact: NewContact = {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zipCode: body.zipCode || null,
      company: body.company || null,
      notes: body.notes || null,
      status: body.status || 'lead',
    }
    
    const [insertedContact] = await db.insert(contacts).values(newContact).returning()
    return NextResponse.json(insertedContact, { status: 201 })
  } catch (error) {
    console.error('Failed to create contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}

// PUT update contact
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }
    
    const [updatedContact] = await db
      .update(contacts)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(contacts.id, id))
      .returning()
    
    if (!updatedContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('Failed to update contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE contact
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }
    
    const [deletedContact] = await db
      .delete(contacts)
      .where(eq(contacts.id, parseInt(id)))
      .returning()
    
    if (!deletedContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, deleted: deletedContact })
  } catch (error) {
    console.error('Failed to delete contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
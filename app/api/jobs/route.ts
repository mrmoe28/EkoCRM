import { NextRequest, NextResponse } from 'next/server'
import { db, jobs, Job, NewJob } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET all jobs
export async function GET() {
  try {
    const allJobs = await db.select().from(jobs).orderBy(jobs.createdAt)
    return NextResponse.json(allJobs)
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newJob: NewJob = {
      title: body.title,
      description: body.description || null,
      contactId: body.contactId || null,
      status: body.status || 'quoted',
      priority: body.priority || 'medium',
      estimatedValue: body.estimatedValue || null,
      actualValue: body.actualValue || null,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      completedDate: body.completedDate || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zipCode: body.zipCode || null,
      notes: body.notes || null,
    }
    
    const [insertedJob] = await db.insert(jobs).values(newJob).returning()
    return NextResponse.json(insertedJob, { status: 201 })
  } catch (error) {
    console.error('Failed to create job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

// PUT update job
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }
    
    const [updatedJob] = await db
      .update(jobs)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jobs.id, id))
      .returning()
    
    if (!updatedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Failed to update job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }
    
    const [deletedJob] = await db
      .delete(jobs)
      .where(eq(jobs.id, parseInt(id)))
      .returning()
    
    if (!deletedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, deleted: deletedJob })
  } catch (error) {
    console.error('Failed to delete job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
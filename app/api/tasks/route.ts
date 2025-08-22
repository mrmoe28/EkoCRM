import { NextRequest, NextResponse } from 'next/server'
import { db, tasks, Task, NewTask } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET all tasks
export async function GET() {
  try {
    const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt)
    return NextResponse.json(allTasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newTask: NewTask = {
      title: body.title,
      description: body.description || null,
      jobId: body.jobId || null,
      contactId: body.contactId || null,
      assignedTo: body.assignedTo || null,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      dueDate: body.dueDate || null,
      completedDate: body.completedDate || null,
      estimatedHours: body.estimatedHours || null,
      actualHours: body.actualHours || null,
      notes: body.notes || null,
    }
    
    const [insertedTask] = await db.insert(tasks).values(newTask).returning()
    return NextResponse.json(insertedTask, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

// PUT update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(tasks.id, id))
      .returning()
    
    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }
    
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .returning()
    
    if (!deletedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, deleted: deletedTask })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
'use client'

import { useState } from 'react'
import { TaskList } from '@/components/tasks/task-list'
import { TaskForm } from '@/components/tasks/task-form'
import { Task, NewTask } from '@/lib/db'
import { ViewToolbar, ViewType } from '@/components/ui/view-toolbar'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleAddTask = () => {
    setEditingTask(undefined)
    setShowForm(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleSaveTask = (taskData: NewTask) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData, updatedAt: new Date() }
          : t
      ))
    } else {
      const newTask: Task = {
        id: Date.now(),
        userId: taskData.userId || null,
        title: taskData.title,
        description: taskData.description || null,
        jobId: taskData.jobId || null,
        contactId: taskData.contactId || null,
        assignedTo: taskData.assignedTo || null,
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        completedDate: taskData.completedDate || null,
        estimatedHours: taskData.estimatedHours || null,
        actualHours: taskData.actualHours || null,
        notes: taskData.notes || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setTasks(prev => [newTask, ...prev])
    }
    setShowForm(false)
    setEditingTask(undefined)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTask(undefined)
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const handleCompleteTask = (taskId: number) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: 'completed', completedDate: new Date().toISOString(), updatedAt: new Date() }
        : t
    ))
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h1 className="text-3xl font-bold gradient-orange-purple">Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your project tasks and to-dos
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-orange to-accent-purple rounded-full mt-4"></div>
      </div>

      {showForm ? (
        <div className="glass-card p-6 rounded-xl">
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="glass-card p-6 rounded-xl">
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
          />
        </div>
      )}
    </div>
  )
}
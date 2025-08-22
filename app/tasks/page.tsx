'use client'

import { useState, useEffect } from 'react'
import { TaskList } from '@/components/tasks/task-list'
import { TaskForm } from '@/components/tasks/task-form'
import { Task, NewTask, Job, Contact } from '@/lib/db'
import { ViewToolbar, ViewType } from '@/components/ui/view-toolbar'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [currentView, setCurrentView] = useState<ViewType>('card')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch tasks, jobs, and contacts on component mount
  useEffect(() => {
    fetchTasks()
    fetchJobs()
    fetchContacts()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

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
          ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
          : t
      ))
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        ? { ...t, status: 'completed', completedDate: new Date().toISOString(), updatedAt: new Date().toISOString() }
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
            jobs={jobs}
            contacts={contacts}
            onSave={handleSaveTask}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          <ViewToolbar
            currentView={currentView}
            onViewChange={setCurrentView}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <div className="glass-card p-6 rounded-xl">
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask}
            />
          </div>
        </>
      )}
    </div>
  )
}
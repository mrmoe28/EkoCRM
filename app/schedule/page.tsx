'use client'

import { useState, useEffect } from 'react'
import { ScheduleCalendar } from '@/components/schedule/schedule-calendar'
import { ScheduleForm } from '@/components/schedule/schedule-form'
import { Schedule, NewSchedule, Job, Task, Contact } from '@/lib/db'

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>()
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Fetch data on component mount
  useEffect(() => {
    fetchSchedules()
    fetchJobs()
    fetchTasks()
    fetchContacts()
  }, [])

  const fetchSchedules = async () => {
    try {
      const data: Schedule[] = [
        // Mock data - you'll need to implement the API endpoint
      ]
      setSchedules(data)
    } catch (error) {
      console.error('Error fetching schedules:', error)
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

  const handleAddSchedule = (date?: string) => {
    setEditingSchedule(undefined)
    setSelectedDate(date || '')
    setShowForm(true)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setShowForm(true)
  }

  const handleSaveSchedule = (scheduleData: NewSchedule) => {
    if (editingSchedule) {
      setSchedules(prev => prev.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, ...scheduleData, updatedAt: new Date() }
          : s
      ))
    } else {
      const newSchedule: Schedule = {
        id: Date.now(),
        userId: null,
        title: scheduleData.title,
        description: scheduleData.description || null,
        jobId: scheduleData.jobId || null,
        taskId: scheduleData.taskId || null,
        contactId: scheduleData.contactId || null,
        assignedTo: scheduleData.assignedTo || null,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        date: scheduleData.date,
        location: scheduleData.location || null,
        status: scheduleData.status || 'scheduled',
        type: scheduleData.type || 'site_visit',
        notes: scheduleData.notes || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setSchedules(prev => [newSchedule, ...prev])
    }
    setShowForm(false)
    setEditingSchedule(undefined)
    setSelectedDate('')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingSchedule(undefined)
    setSelectedDate('')
  }

  const handleDeleteSchedule = (scheduleId: number) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-orange-purple">Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Manage appointments, site visits, and installation schedules
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-purple to-accent-orange rounded-full mt-4"></div>
      </div>

      {showForm ? (
        <div className="glass-card p-6 rounded-xl">
          <ScheduleForm
            schedule={editingSchedule}
            selectedDate={selectedDate}
            jobs={jobs}
            tasks={tasks}
            contacts={contacts}
            onSave={handleSaveSchedule}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ScheduleCalendar
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { ScheduleCalendar } from '@/components/schedule/schedule-calendar'
import { ScheduleForm } from '@/components/schedule/schedule-form'
import { Schedule, NewSchedule } from '@/lib/db'

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>()
  const [selectedDate, setSelectedDate] = useState<string>('')

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
          ? { ...s, ...scheduleData, updatedAt: new Date().toISOString() }
          : s
      ))
    } else {
      const newSchedule: Schedule = {
        ...scheduleData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
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
            onSave={handleSaveSchedule}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="glass-card p-6 rounded-xl">
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
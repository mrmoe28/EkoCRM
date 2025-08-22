'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Save } from 'lucide-react'
import { Schedule, NewSchedule, Job, Task, Contact } from '@/lib/db'

interface ScheduleFormProps {
  schedule?: Schedule
  selectedDate?: string
  jobs?: Job[]
  tasks?: Task[]
  contacts?: Contact[]
  onSave: (schedule: NewSchedule) => void
  onCancel: () => void
}

export function ScheduleForm({ schedule, selectedDate, jobs, tasks, contacts, onSave, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState<NewSchedule>({
    title: schedule?.title || '',
    description: schedule?.description || '',
    jobId: schedule?.jobId || null,
    taskId: schedule?.taskId || null,
    contactId: schedule?.contactId || null,
    assignedTo: schedule?.assignedTo || '',
    startTime: schedule?.startTime || '09:00',
    endTime: schedule?.endTime || '10:00',
    date: schedule?.date || selectedDate || new Date().toISOString().split('T')[0],
    location: schedule?.location || '',
    type: schedule?.type || 'site_visit',
    status: schedule?.status || 'scheduled',
    notes: schedule?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof NewSchedule, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{schedule ? 'Edit Appointment' : 'Add New Appointment'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Appointment Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Site visit with John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Related Job</label>
                <select
                  value={formData.jobId || ''}
                  onChange={(e) => handleChange('jobId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a job...</option>
                  {jobs?.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  )) || (
                    <option disabled>No jobs available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Related Task</label>
                <select
                  value={formData.taskId || ''}
                  onChange={(e) => handleChange('taskId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a task...</option>
                  {tasks?.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  )) || (
                    <option disabled>No tasks available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Customer</label>
                <select
                  value={formData.contactId || ''}
                  onChange={(e) => handleChange('contactId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a customer...</option>
                  {contacts?.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} {contact.company && `(${contact.company})`}
                    </option>
                  )) || (
                    <option disabled>No contacts available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Input
                  value={formData.assignedTo || ''}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  placeholder="Technician name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={formData.type || 'site_visit'}
                    onChange={(e) => handleChange('type', e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="site_visit">Site Visit</option>
                    <option value="installation">Installation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow Up</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status || 'scheduled'}
                    onChange={(e) => handleChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time *</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time *</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Customer's address or meeting location"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder="Brief description of the appointment..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder="Additional notes, special requirements, tools needed, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="orange">
              <Save className="h-4 w-4 mr-2" />
              Save Appointment
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
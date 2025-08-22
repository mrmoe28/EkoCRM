'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Save } from 'lucide-react'
import { Task, NewTask, Job, Contact } from '@/lib/db'

interface TaskFormProps {
  task?: Task
  jobs?: Job[]
  contacts?: Contact[]
  onSave: (task: NewTask) => void
  onCancel: () => void
}

export function TaskForm({ task, jobs, contacts, onSave, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<NewTask>({
    title: task?.title || '',
    description: task?.description || '',
    jobId: task?.jobId || null,
    contactId: task?.contactId || null,
    assignedTo: task?.assignedTo || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
    estimatedHours: task?.estimatedHours || null,
    actualHours: task?.actualHours || null,
    notes: task?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof NewTask, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{task ? 'Edit Task' : 'Add New Task'}</CardTitle>
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
                <label className="text-sm font-medium">Task Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Install solar panels on south roof"
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
                <label className="text-sm font-medium">Related Contact</label>
                <select
                  value={formData.contactId || ''}
                  onChange={(e) => handleChange('contactId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a contact...</option>
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
                  placeholder="John Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => handleChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => handleChange('priority', e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Estimated Hours</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.estimatedHours || ''}
                    onChange={(e) => handleChange('estimatedHours', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="8.0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Actual Hours</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.actualHours || ''}
                    onChange={(e) => handleChange('actualHours', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="7.5"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Task Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder="Detailed description of the task..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder="Special instructions, tools needed, safety requirements, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Task
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
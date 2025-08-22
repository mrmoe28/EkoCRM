'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Save } from 'lucide-react'
import { Job, NewJob, Contact } from '@/lib/db'

interface JobFormProps {
  job?: Job
  contacts?: Contact[]
  onSave: (job: NewJob) => void
  onCancel: () => void
}

export function JobForm({ job, contacts, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState<NewJob>({
    title: job?.title || '',
    description: job?.description || '',
    contactId: job?.contactId || null,
    status: job?.status || 'quoted',
    priority: job?.priority || 'medium',
    estimatedValue: job?.estimatedValue || null,
    actualValue: job?.actualValue || null,
    startDate: job?.startDate || '',
    endDate: job?.endDate || '',
    address: job?.address || '',
    city: job?.city || '',
    state: job?.state || '',
    zipCode: job?.zipCode || '',
    notes: job?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof NewJob, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{job ? 'Edit Job' : 'Add New Job'}</CardTitle>
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
                <label className="text-sm font-medium">Job Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Solar installation project"
                  required
                />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status || 'quoted'}
                    onChange={(e) => handleChange('status', e.target.value as any)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="quoted">Quoted</option>
                    <option value="approved">Approved</option>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Estimated Value</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.estimatedValue || ''}
                    onChange={(e) => handleChange('estimatedValue', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="25000.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Actual Value</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.actualValue || ''}
                    onChange={(e) => handleChange('actualValue', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="24500.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder="Describe the solar installation project..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Job Site Address</label>
                <Input
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Atlanta"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={formData.state || ''}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="GA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input
                    value={formData.zipCode || ''}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    placeholder="30309"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Project Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder="Additional notes, special requirements, etc."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="orange">
              <Save className="h-4 w-4 mr-2" />
              Save Job
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
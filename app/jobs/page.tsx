'use client'

import { useState, useEffect } from 'react'
import { JobList } from '@/components/jobs/job-list'
import { JobForm } from '@/components/jobs/job-form'
import { Job, NewJob, Contact } from '@/lib/db'
import { ViewToolbar, ViewType } from '@/components/ui/view-toolbar'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()
  const [currentView, setCurrentView] = useState<ViewType>('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch jobs and contacts from API on component mount
  useEffect(() => {
    fetchJobs()
    fetchContacts()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        console.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      } else {
        console.error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const handleAddJob = () => {
    setEditingJob(undefined)
    setShowForm(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleSaveJob = async (jobData: NewJob) => {
    try {
      if (editingJob) {
        // Update existing job
        const response = await fetch('/api/jobs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingJob.id, ...jobData })
        })
        
        if (response.ok) {
          const updatedJob = await response.json()
          setJobs(prev => prev.map(j => 
            j.id === editingJob.id ? updatedJob : j
          ))
        } else {
          console.error('Failed to update job')
        }
      } else {
        // Create new job
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData)
        })
        
        if (response.ok) {
          const newJob = await response.json()
          setJobs(prev => [newJob, ...prev])
        } else {
          console.error('Failed to create job')
        }
      }
      setShowForm(false)
      setEditingJob(undefined)
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(undefined)
  }

  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs?id=${jobId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setJobs(prev => prev.filter(j => j.id !== jobId))
      } else {
        console.error('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h1 className="text-3xl font-bold gradient-orange-purple">Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Manage your solar installation projects and jobs
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-purple to-accent-orange rounded-full mt-4"></div>
      </div>

      {showForm ? (
        <div className="glass-card p-6 rounded-xl">
          <JobForm
            job={editingJob}
            contacts={contacts}
            onSave={handleSaveJob}
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
            <JobList
              jobs={jobs}
              onAddJob={handleAddJob}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteJob}
              viewType={currentView}
              searchTerm={searchTerm}
            />
          </div>
        </>
      )}
    </div>
  )
}
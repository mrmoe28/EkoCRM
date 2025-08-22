'use client'

import { useState } from 'react'
import { JobList } from '@/components/jobs/job-list'
import { JobForm } from '@/components/jobs/job-form'
import { Job, NewJob } from '@/lib/db'
import { ViewToolbar, ViewType } from '@/components/ui/view-toolbar'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()
  const [currentView, setCurrentView] = useState<ViewType>('card')
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddJob = () => {
    setEditingJob(undefined)
    setShowForm(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleSaveJob = (jobData: NewJob) => {
    if (editingJob) {
      setJobs(prev => prev.map(j => 
        j.id === editingJob.id 
          ? { ...j, ...jobData, updatedAt: new Date().toISOString() }
          : j
      ))
    } else {
      const newJob: Job = {
        ...jobData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setJobs(prev => [newJob, ...prev])
    }
    setShowForm(false)
    setEditingJob(undefined)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(undefined)
  }

  const handleDeleteJob = (jobId: number) => {
    setJobs(prev => prev.filter(j => j.id !== jobId))
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
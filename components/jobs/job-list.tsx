'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, MapPin, DollarSign, Calendar, Edit2 } from 'lucide-react'
import { Job } from '@/lib/db'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { ViewType } from '@/components/ui/view-toolbar'

interface JobListProps {
  jobs: Job[]
  onAddJob: () => void
  onEditJob: (job: Job) => void
  onDeleteJob?: (jobId: number) => void
  viewType?: ViewType
  searchTerm?: string
}

export function JobList({ 
  jobs, 
  onAddJob, 
  onEditJob, 
  onDeleteJob,
  viewType = 'card',
  searchTerm: externalSearchTerm
}: JobListProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Use external search term if provided, otherwise use internal
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Render functions for different view types
  const renderCardView = () => (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredJobs.map((job) => (
        <Card key={job.id} className="w-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEditJob(job)}>
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base sm:text-lg line-clamp-2 flex-1">{job.title}</CardTitle>
              <div className="flex flex-col gap-1 shrink-0">
                <Badge className={cn(getStatusColor(job.status || 'quoted'), "text-xs")}>
                  {job.status?.replace('_', ' ') || 'quoted'}
                </Badge>
                <Badge variant="outline" className={cn(getPriorityColor(job.priority || 'medium'), "text-xs")}>
                  {job.priority || 'medium'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {job.description && (
              <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm">{job.description}</p>
            )}
            
            {job.estimatedValue && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-xs sm:text-sm">{formatCurrency(job.estimatedValue)}</span>
              </div>
            )}

            {(job.city && job.state) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="truncate text-xs sm:text-sm">{job.city}, {job.state}</span>
              </div>
            )}

            {job.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm">Start: {formatDate(job.startDate)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      {filteredJobs.map((job) => (
        <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEditJob(job)}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{job.title}</span>
                    <Badge className={getStatusColor(job.status || 'quoted')}>
                      {job.status?.replace('_', ' ') || 'quoted'}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(job.priority || 'medium')}>
                      {job.priority || 'medium'}
                    </Badge>
                  </div>
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  {job.estimatedValue && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden sm:inline">{formatCurrency(job.estimatedValue)}</span>
                    </div>
                  )}
                  {job.startDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">{formatDate(job.startDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Title</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Priority</th>
            <th className="text-left p-4">Value</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Start Date</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.id} className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => onEditJob(job)}>
              <td className="p-4">
                <div>
                  <p className="font-medium">{job.title}</p>
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                  )}
                </div>
              </td>
              <td className="p-4">
                <Badge className={getStatusColor(job.status || 'quoted')}>
                  {job.status?.replace('_', ' ') || 'quoted'}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant="outline" className={getPriorityColor(job.priority || 'medium')}>
                  {job.priority || 'medium'}
                </Badge>
              </td>
              <td className="p-4">{job.estimatedValue ? formatCurrency(job.estimatedValue) : '-'}</td>
              <td className="p-4">{job.city && job.state ? `${job.city}, ${job.state}` : '-'}</td>
              <td className="p-4">{job.startDate ? formatDate(job.startDate) : '-'}</td>
              <td className="p-4">
                <Button variant="ghost" size="icon" onClick={(e) => {
                  e.stopPropagation()
                  onEditJob(job)
                }}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {!externalSearchTerm && (
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={internalSearchTerm}
              onChange={(e) => setInternalSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        )}
        <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-input rounded-md bg-background text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="quoted">Quoted</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="orange" onClick={onAddJob} className="shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Job</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {viewType === 'card' && renderCardView()}
      {viewType === 'list' && renderListView()}
      {viewType === 'table' && renderTableView()}

      {filteredJobs.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">No jobs found.</p>
          <Button variant="orange" onClick={onAddJob} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Job
          </Button>
        </div>
      )}
    </div>
  )
}
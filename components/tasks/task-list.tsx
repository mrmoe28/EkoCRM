'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, CheckCircle2, Clock, Calendar, User } from 'lucide-react'
import { Task } from '@/lib/db'
import { formatDate, cn } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask?: (taskId: number) => void
  onCompleteTask?: (taskId: number) => void
}

export function TaskList({ tasks, onAddTask, onEditTask, onDeleteTask, onCompleteTask }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
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

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-input rounded-md bg-background text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="orange" onClick={onAddTask} className="shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="w-full cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onEditTask(task)}>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base sm:text-lg line-clamp-2 flex-1">{task.title}</CardTitle>
                <div className="flex flex-col gap-1 shrink-0">
                  <Badge className={cn(getStatusColor(task.status || 'pending'), "text-xs")}>
                    {task.status?.replace('_', ' ') || 'pending'}
                  </Badge>
                  <Badge variant="outline" className={cn(getPriorityColor(task.priority || 'medium'), "text-xs")}>
                    {task.priority || 'medium'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {task.description && (
                <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm">{task.description}</p>
              )}
              
              {task.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs sm:text-sm truncate">{task.assignedTo}</span>
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs sm:text-sm">Due: {formatDate(task.dueDate)}</span>
                </div>
              )}

              {task.estimatedHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs sm:text-sm">{task.estimatedHours}h estimated</span>
                </div>
              )}

              {task.status === 'pending' && onCompleteTask && (
                <div className="pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full text-xs sm:text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCompleteTask(task.id)
                    }}
                  >
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Mark Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">No tasks found.</p>
          <Button variant="orange" onClick={onAddTask} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Task
          </Button>
        </div>
      )}
    </div>
  )
}
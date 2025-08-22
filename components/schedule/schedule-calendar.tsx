'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react'
import { Schedule } from '@/lib/db'
import { formatDate, formatDateTime } from '@/lib/utils'

interface ScheduleCalendarProps {
  schedules: Schedule[]
  onAddSchedule: (date?: string) => void
  onEditSchedule: (schedule: Schedule) => void
  onDeleteSchedule?: (scheduleId: number) => void
}

export function ScheduleCalendar({ schedules, onAddSchedule, onEditSchedule, onDeleteSchedule }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'site_visit': return 'bg-blue-100 text-blue-800'
      case 'installation': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'consultation': return 'bg-purple-100 text-purple-800'
      case 'follow_up': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return schedules.filter(schedule => schedule.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const today = new Date()
  const days = getDaysInMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Get today's schedules for the sidebar
  const todaySchedules = getSchedulesForDate(today)
  const upcomingSchedules = schedules
    .filter(s => new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Calendar */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold gradient-orange-purple">{monthYear}</h2>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="purple" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="glass" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="orange" onClick={() => onAddSchedule()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-20" />
                }
                
                const daySchedules = getSchedulesForDate(day)
                const isToday = day.toDateString() === today.toDateString()
                const dateString = day.toISOString().split('T')[0]
                
                const hasAppointments = daySchedules.length > 0
                
                return (
                  <div
                    key={day.toString()}
                    className={`h-20 p-1 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform-gpu ${
                      isToday 
                        ? 'bg-gradient-to-br from-accent-purple to-accent-orange border-accent-purple shadow-2xl text-white' 
                        : hasAppointments
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 shadow-lg text-white'
                        : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-accent-purple dark:border-accent-purple shadow-md hover:shadow-lg hover:border-accent-orange'
                    }`}
                    onClick={() => onAddSchedule(dateString)}
                  >
                    <div className={`font-medium text-sm mb-1 ${
                      isToday 
                        ? 'text-white font-bold' 
                        : hasAppointments 
                        ? 'text-white font-semibold' 
                        : 'text-foreground'
                    }`}>
                      {day.getDate()}
                      {hasAppointments && (
                        <div className="w-2 h-2 bg-white rounded-full ml-auto mt-0.5 animate-pulse shadow-sm"></div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {daySchedules.slice(0, 2).map(schedule => (
                        <div
                          key={schedule.id}
                          className="text-xs p-1 rounded-md bg-white border-2 border-white shadow-md truncate cursor-pointer hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditSchedule(schedule)
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-accent-purple rounded-full"></div>
                            <span className="font-bold text-accent-purple">
                              {schedule.startTime}
                            </span>
                          </div>
                          <div className="text-gray-800 truncate font-medium">
                            {schedule.title}
                          </div>
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-xs text-white font-bold bg-accent-orange rounded px-1 py-0.5 shadow-sm">
                          +{daySchedules.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Today's Schedule */}
        <Card variant="glass" className="glass-purple">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-purple" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {todaySchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="p-3 border-2 border-accent-purple/30 rounded-lg cursor-pointer hover:bg-accent-purple/10 hover:border-accent-purple transition-all duration-200 glass-card transform-gpu"
                    style={{
                      willChange: 'transform',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = ''
                    }}
                    onClick={() => onEditSchedule(schedule)}
                  >
                    <div className="font-medium text-accent-purple">{schedule.title}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 text-accent-orange" />
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    {schedule.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 text-accent-orange" />
                        {schedule.location}
                      </div>
                    )}
                    <div className="flex gap-1 mt-2">
                      <Badge className={getTypeColor(schedule.type || 'site_visit')}>
                        {schedule.type?.replace('_', ' ') || 'Site Visit'}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(schedule.status || 'scheduled')}>
                        {schedule.status || 'Scheduled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No appointments today</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card variant="glass" className="glass-orange">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-accent-orange" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSchedules.length > 0 ? (
              <div className="space-y-3">
                {upcomingSchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="p-3 border-2 border-accent-orange/30 rounded-lg cursor-pointer hover:bg-accent-orange/10 hover:border-accent-orange transition-all duration-200 glass-card transform-gpu"
                    style={{
                      willChange: 'transform',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = ''
                    }}
                    onClick={() => onEditSchedule(schedule)}
                  >
                    <div className="font-medium text-accent-orange">{schedule.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3 text-accent-purple" />
                      {formatDate(schedule.date)} at {schedule.startTime}
                    </div>
                    <Badge className={getTypeColor(schedule.type || 'site_visit')}>
                      {schedule.type?.replace('_', ' ') || 'Site Visit'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
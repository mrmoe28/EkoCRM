'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react'
import { Schedule } from '@/lib/db'
import { formatDate, formatDateTime, cn } from '@/lib/utils'

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
    <div className="w-full space-y-4 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:h-full">
      {/* Calendar */}
      <div className="w-full lg:col-span-3 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold gradient-orange-purple">{monthYear}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Button variant="glass" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="purple" size="sm" onClick={() => setCurrentDate(new Date())}>
                <span className="hidden sm:inline">Today</span>
                <span className="sm:hidden">Now</span>
              </Button>
              <Button variant="glass" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="orange" onClick={() => onAddSchedule()} className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Appointment</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 w-full">
            <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="p-1 sm:p-2 text-center font-medium text-xs sm:text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-12 sm:h-16 md:h-20" />
                }
                
                const daySchedules = getSchedulesForDate(day)
                const isToday = day.toDateString() === today.toDateString()
                const dateString = day.toISOString().split('T')[0]
                
                const hasAppointments = daySchedules.length > 0
                
                return (
                  <div
                    key={day.toString()}
                    className={`h-12 sm:h-16 md:h-20 p-1 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform-gpu ${
                      isToday 
                        ? 'bg-gradient-to-br from-accent-purple to-accent-orange border-accent-purple shadow-2xl text-white' 
                        : hasAppointments
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 shadow-lg text-white'
                        : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-accent-purple dark:border-accent-purple shadow-md hover:shadow-lg hover:border-accent-orange'
                    }`}
                    onClick={() => onAddSchedule(dateString)}
                  >
                    <div className={`font-medium text-xs sm:text-sm mb-1 flex items-center justify-between ${
                      isToday 
                        ? 'text-white font-bold' 
                        : hasAppointments 
                        ? 'text-white font-semibold' 
                        : 'text-foreground'
                    }`}>
                      <span>{day.getDate()}</span>
                      {hasAppointments && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                      )}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 hidden sm:block">
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
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-purple rounded-full"></div>
                            <span className="font-bold text-accent-purple text-xs">
                              {schedule.startTime}
                            </span>
                          </div>
                          <div className="text-gray-800 truncate font-medium text-xs">
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
                    {/* Mobile indicator */}
                    {hasAppointments && (
                      <div className="sm:hidden text-xs text-center mt-1">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                          isToday || hasAppointments ? 'text-white bg-white/20' : 'text-accent-orange bg-accent-orange/10'
                        }`}>
                          {daySchedules.length}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
        </div>
      </div>

      {/* Sidebar - Desktop only on large screens, full width on mobile */}
      <div className="w-full lg:w-auto space-y-4 lg:space-y-6">
        {/* Today's Schedule */}
        <Card variant="glass" className="glass-purple w-full">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-accent-purple" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            {todaySchedules.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {todaySchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="p-2 lg:p-3 border-2 border-accent-purple/30 rounded-lg cursor-pointer hover:bg-accent-purple/10 hover:border-accent-purple transition-all duration-200 glass-card transform-gpu"
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
                    <div className="font-medium text-accent-purple text-sm lg:text-base truncate">{schedule.title}</div>
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 text-accent-orange" />
                      <span className="truncate">{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    {schedule.location && (
                      <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 text-accent-orange" />
                        <span className="truncate">{schedule.location}</span>
                      </div>
                    )}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <Badge className={cn(getTypeColor(schedule.type || 'site_visit'), "text-xs")}>
                        {schedule.type?.replace('_', ' ') || 'Site Visit'}
                      </Badge>
                      <Badge variant="outline" className={cn(getStatusColor(schedule.status || 'scheduled'), "text-xs")}>
                        {schedule.status || 'Scheduled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 lg:py-8 text-sm">No appointments today</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card variant="glass" className="glass-orange w-full">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-accent-orange" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            {upcomingSchedules.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {upcomingSchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="p-2 lg:p-3 border-2 border-accent-orange/30 rounded-lg cursor-pointer hover:bg-accent-orange/10 hover:border-accent-orange transition-all duration-200 glass-card transform-gpu"
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
                    <div className="font-medium text-accent-orange text-sm lg:text-base truncate">{schedule.title}</div>
                    <div className="text-xs lg:text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3 text-accent-purple" />
                      <span className="truncate">{formatDate(schedule.date)} at {schedule.startTime}</span>
                    </div>
                    <Badge className={cn(getTypeColor(schedule.type || 'site_visit'), "text-xs")}>
                      {schedule.type?.replace('_', ' ') || 'Site Visit'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 lg:py-8 text-sm">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
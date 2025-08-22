import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, CheckSquare, Calendar } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Contacts',
      value: '0',
      icon: Users,
      description: 'Active contacts in system'
    },
    {
      title: 'Active Jobs',
      value: '0',
      icon: Briefcase,
      description: 'Jobs in progress'
    },
    {
      title: 'Pending Tasks',
      value: '0',
      icon: CheckSquare,
      description: 'Tasks awaiting completion'
    },
    {
      title: 'Appointments',
      value: '0',
      icon: Calendar,
      description: 'Scheduled for today'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your solar project management dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} variant="glass" className="group hover:scale-[1.02] relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 transition-all duration-300 ${
                  stat.title === 'Total Contacts' ? 'text-accent-orange group-hover:scale-110' :
                  stat.title === 'Active Jobs' ? 'text-accent-purple group-hover:scale-110' :
                  stat.title === 'Pending Tasks' ? 'text-accent-orange group-hover:scale-110' :
                  'text-accent-purple group-hover:scale-110'
                }`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  stat.title === 'Total Contacts' ? 'gradient-orange-purple' :
                  stat.title === 'Active Jobs' ? 'bg-gradient-to-r from-accent-purple to-accent-purple-hover bg-clip-text text-transparent' :
                  stat.title === 'Pending Tasks' ? 'bg-gradient-to-r from-accent-orange to-accent-orange-hover bg-clip-text text-transparent' :
                  'gradient-orange-purple'
                }`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
              <div className={`absolute top-0 right-0 w-1 h-full ${
                stat.title === 'Total Contacts' ? 'bg-gradient-to-b from-accent-orange to-transparent' :
                stat.title === 'Active Jobs' ? 'bg-gradient-to-b from-accent-purple to-transparent' :
                stat.title === 'Pending Tasks' ? 'bg-gradient-to-b from-accent-orange to-transparent' :
                'bg-gradient-to-b from-accent-purple to-transparent'
              }`}></div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="floating" className="hover:scale-[1.01] glass-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Activity
              <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No recent activity to display
            </p>
          </CardContent>
        </Card>

        <Card variant="floating" className="hover:scale-[1.01] glass-orange">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Upcoming Appointments
              <Calendar className="h-4 w-4 text-accent-orange" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No upcoming appointments
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
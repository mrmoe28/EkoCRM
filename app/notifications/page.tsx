'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Mail, MessageSquare, Calendar, Settings } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    marketing: false,
    updates: true,
    reminders: true,
    security: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Notification Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Methods
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <div>
                  <Label htmlFor="email">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="email"
                checked={notifications.email}
                onCheckedChange={() => handleToggle('email')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                <div>
                  <Label htmlFor="push">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                </div>
              </div>
              <Switch
                id="push"
                checked={notifications.push}
                onCheckedChange={() => handleToggle('push')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                <div>
                  <Label htmlFor="sms">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
              </div>
              <Switch
                id="sms"
                checked={notifications.sms}
                onCheckedChange={() => handleToggle('sms')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                <div>
                  <Label htmlFor="inApp">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                </div>
              </div>
              <Switch
                id="inApp"
                checked={notifications.inApp}
                onCheckedChange={() => handleToggle('inApp')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Choose what types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminders">Task & Job Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks and job deadlines</p>
              </div>
              <Switch
                id="reminders"
                checked={notifications.reminders}
                onCheckedChange={() => handleToggle('reminders')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications about system updates and new features</p>
              </div>
              <Switch
                id="updates"
                checked={notifications.updates}
                onCheckedChange={() => handleToggle('updates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="security">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Important security notifications and login alerts</p>
              </div>
              <Switch
                id="security"
                checked={notifications.security}
                onCheckedChange={() => handleToggle('security')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing">Marketing & Promotions</Label>
                <p className="text-sm text-muted-foreground">Promotional emails and marketing updates</p>
              </div>
              <Switch
                id="marketing"
                checked={notifications.marketing}
                onCheckedChange={() => handleToggle('marketing')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
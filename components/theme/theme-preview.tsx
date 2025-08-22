'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useExtendedTheme } from '@/lib/theme-provider'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'

export function ThemePreview() {
  const { mode, setMode } = useExtendedTheme()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Appearance Settings</h2>
        <p className="text-muted-foreground">
          Customize your interface appearance with light and dark modes.
        </p>
      </div>

      {/* Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Theme Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={mode === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('light')}
              className="gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={mode === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('dark')}
              className="gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={mode === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('system')}
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 p-4 border rounded bg-card">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <div className="text-sm font-medium">Sample Interface</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Primary Button</Button>
              <Button variant="outline" size="sm">Secondary</Button>
            </div>
            <div className="w-full h-2 rounded bg-accent" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Current Mode</div>
              <div className="text-muted-foreground capitalize">{mode}</div>
            </div>
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-muted-foreground">Solar Energy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
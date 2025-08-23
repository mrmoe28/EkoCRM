'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Settings, 
  LogOut, 
  UserCircle, 
  Camera,
  Palette,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load profile image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage')
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImage(base64String)
        localStorage.setItem('profileImage', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const menuItems = [
    { icon: User, label: 'My Profile', onClick: () => window.location.href = '/profile' },
    { icon: Palette, label: 'Appearance', onClick: () => window.location.href = '/themes' },
    { icon: Bell, label: 'Notifications', onClick: () => window.location.href = '/notifications' },
    { icon: Shield, label: 'Privacy & Security', onClick: () => window.location.href = '/privacy-security' },
    { icon: Settings, label: 'Settings', onClick: () => console.log('Settings') },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => window.location.href = '/help-support' },
    { divider: true },
    { icon: LogOut, label: 'Sign Out', onClick: handleLogout, className: 'text-red-600 hover:text-red-700' },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary transition-all"
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-gray-800 border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Profile Header */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user?.name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-2 border-t border-border" />
              }
              
              const Icon = item.icon!
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left",
                    item.className
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
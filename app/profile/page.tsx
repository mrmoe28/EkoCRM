'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { User, Mail, Phone, MapPin, Camera, Save, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    company: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        company: user.company || ''
      })
    }
    
    const savedImage = localStorage.getItem('profileImage')
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [user])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateUser?.(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account settings and personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 text-center shadow-lg">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                )}
              </div>
              <label 
                htmlFor="profile-image-upload" 
                className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
              >
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">{user.name}</h3>
            <p className="text-xs sm:text-sm text-gray-300">{user.email}</p>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">0</div>
                    <div className="text-sm text-gray-300">Total Contacts</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">0</div>
                    <div className="text-sm text-gray-300">Active Jobs</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">0</div>
                    <div className="text-sm text-gray-300">Pending Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
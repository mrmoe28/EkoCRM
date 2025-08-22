'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Phone, Mail, MapPin, Edit2 } from 'lucide-react'
import { Contact } from '@/lib/db'
import { ViewType } from '@/components/ui/view-toolbar'

interface ContactListProps {
  contacts: Contact[]
  onAddContact: () => void
  onEditContact: (contact: Contact) => void
  viewType?: ViewType
  searchTerm?: string
}

export function ContactList({ 
  contacts, 
  onAddContact, 
  onEditContact,
  viewType = 'card',
  searchTerm: externalSearchTerm
}: ContactListProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Use external search term if provided, otherwise use internal
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone?.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800'
      case 'prospect': return 'bg-yellow-100 text-yellow-800'
      case 'customer': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Render functions for different view types
  const renderCardView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredContacts.map((contact) => (
        <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEditContact(contact)}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{contact.name}</CardTitle>
              <Badge className={getStatusColor(contact.status || 'lead')}>
                {contact.status || 'lead'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {contact.company && (
              <p className="text-sm text-muted-foreground font-medium">{contact.company}</p>
            )}
            {contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {contact.city && contact.state ? 
                    `${contact.city}, ${contact.state}` : 
                    contact.address
                  }
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      {filteredContacts.map((contact) => (
        <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEditContact(contact)}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{contact.name}</span>
                    <Badge className={getStatusColor(contact.status || 'lead')}>
                      {contact.status || 'lead'}
                    </Badge>
                  </div>
                  {contact.company && (
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  {contact.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">{contact.phone}</span>
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
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Company</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Phone</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => onEditContact(contact)}>
              <td className="p-4 font-medium">{contact.name}</td>
              <td className="p-4">{contact.company || '-'}</td>
              <td className="p-4">{contact.email || '-'}</td>
              <td className="p-4">{contact.phone || '-'}</td>
              <td className="p-4">
                <Badge className={getStatusColor(contact.status || 'lead')}>
                  {contact.status || 'lead'}
                </Badge>
              </td>
              <td className="p-4">
                <Button variant="ghost" size="icon" onClick={(e) => {
                  e.stopPropagation()
                  onEditContact(contact)
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {!externalSearchTerm && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={internalSearchTerm}
              onChange={(e) => setInternalSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button onClick={onAddContact}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {viewType === 'card' && renderCardView()}
      {viewType === 'list' && renderListView()}
      {viewType === 'table' && renderTableView()}

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contacts found.</p>
          <Button onClick={onAddContact} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Contact
          </Button>
        </div>
      )}
    </div>
  )
}
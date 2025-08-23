'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Phone, Mail, MapPin, Edit2 } from 'lucide-react'
import { Contact } from '@/lib/db'
import { ViewType } from '@/components/ui/view-toolbar'
import { cn } from '@/lib/utils'

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
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredContacts.map((contact) => (
        <Card key={contact.id} className="w-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEditContact(contact)}>
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base sm:text-lg line-clamp-2 flex-1">{contact.name}</CardTitle>
              <Badge className={cn(getStatusColor(contact.status || 'lead'), "text-xs shrink-0")}>
                {contact.status || 'lead'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {contact.company && (
              <p className="text-muted-foreground font-medium truncate">{contact.company}</p>
            )}
            {contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="truncate text-xs sm:text-sm">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm">{contact.phone}</span>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="truncate text-xs sm:text-sm">
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
    <div className="w-full max-w-full overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 sm:p-4 text-sm font-medium">Name</th>
            <th className="text-left p-2 sm:p-4 text-sm font-medium hidden sm:table-cell">Company</th>
            <th className="text-left p-2 sm:p-4 text-sm font-medium">Email</th>
            <th className="text-left p-2 sm:p-4 text-sm font-medium hidden md:table-cell">Phone</th>
            <th className="text-left p-2 sm:p-4 text-sm font-medium">Status</th>
            <th className="text-left p-2 sm:p-4 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => onEditContact(contact)}>
              <td className="p-2 sm:p-4">
                <div>
                  <div className="font-medium text-sm">{contact.name}</div>
                  <div className="text-xs text-muted-foreground sm:hidden">
                    {contact.company && <span>{contact.company}</span>}
                  </div>
                </div>
              </td>
              <td className="p-2 sm:p-4 text-sm hidden sm:table-cell">{contact.company || '-'}</td>
              <td className="p-2 sm:p-4">
                <div className="max-w-[150px] truncate text-sm">{contact.email || '-'}</div>
                <div className="text-xs text-muted-foreground md:hidden">
                  {contact.phone && <span>{contact.phone}</span>}
                </div>
              </td>
              <td className="p-2 sm:p-4 text-sm hidden md:table-cell">{contact.phone || '-'}</td>
              <td className="p-2 sm:p-4">
                <Badge className={cn(getStatusColor(contact.status || 'lead'), "text-xs")}>
                  {contact.status || 'lead'}
                </Badge>
              </td>
              <td className="p-2 sm:p-4">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation()
                  onEditContact(contact)
                }}>
                  <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
              placeholder="Search contacts..."
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
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="orange" onClick={onAddContact} className="shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Contact</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {viewType === 'card' && renderCardView()}
      {viewType === 'list' && renderListView()}
      {viewType === 'table' && renderTableView()}

      {filteredContacts.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">No contacts found.</p>
          <Button variant="orange" onClick={onAddContact} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Contact
          </Button>
        </div>
      )}
    </div>
  )
}
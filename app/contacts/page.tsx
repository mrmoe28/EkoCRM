'use client'

import { useState, useEffect } from 'react'
import { ContactList } from '@/components/contacts/contact-list'
import { ContactForm } from '@/components/contacts/contact-form'
import { Contact, NewContact } from '@/lib/db'
import { ViewToolbar, ViewType } from '@/components/ui/view-toolbar'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | undefined>()
  const [currentView, setCurrentView] = useState<ViewType>('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch contacts from API on component mount
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      } else {
        console.error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = () => {
    setEditingContact(undefined)
    setShowForm(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleSaveContact = async (contactData: NewContact) => {
    try {
      if (editingContact) {
        // Update existing contact
        const response = await fetch('/api/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingContact.id, ...contactData })
        })
        
        if (response.ok) {
          const updatedContact = await response.json()
          setContacts(prev => prev.map(c => 
            c.id === editingContact.id ? updatedContact : c
          ))
        } else {
          console.error('Failed to update contact')
        }
      } else {
        // Create new contact
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        })
        
        if (response.ok) {
          const newContact = await response.json()
          setContacts(prev => [newContact, ...prev])
        } else {
          console.error('Failed to create contact')
        }
      }
      setShowForm(false)
      setEditingContact(undefined)
    } catch (error) {
      console.error('Error saving contact:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingContact(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h1 className="text-3xl font-bold gradient-orange-purple">Contacts</h1>
        <p className="text-muted-foreground mt-2">
          Manage your solar prospects and customers
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-orange to-accent-purple rounded-full mt-4"></div>
      </div>

      {showForm ? (
        <div className="glass-card p-6 rounded-xl">
          <ContactForm
            contact={editingContact}
            onSave={handleSaveContact}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          <ViewToolbar
            currentView={currentView}
            onViewChange={setCurrentView}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <div className="glass-card p-6 rounded-xl">
            <ContactList
              contacts={contacts}
              onAddContact={handleAddContact}
              onEditContact={handleEditContact}
              viewType={currentView}
              searchTerm={searchTerm}
            />
          </div>
        </>
      )}
    </div>
  )
}
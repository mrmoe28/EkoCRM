'use client'

import { useState } from 'react'
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

  const handleAddContact = () => {
    setEditingContact(undefined)
    setShowForm(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleSaveContact = (contactData: NewContact) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...contactData, updatedAt: new Date().toISOString() }
          : c
      ))
    } else {
      const newContact: Contact = {
        ...contactData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setContacts(prev => [newContact, ...prev])
    }
    setShowForm(false)
    setEditingContact(undefined)
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
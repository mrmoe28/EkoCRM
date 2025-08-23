'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Mail, 
  Phone,
  BookOpen,
  Video,
  FileText
} from 'lucide-react'

export default function HelpSupportPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })

  const faqs = [
    {
      question: "How do I create a new contact?",
      answer: "To create a new contact, navigate to the Contacts page and click the 'Add Contact' button. Fill in the required information and click 'Save'."
    },
    {
      question: "How do I schedule a job?",
      answer: "Go to the Jobs page and click 'Schedule New Job'. Select the contact, date, time, and job details. The job will appear in your schedule automatically."
    },
    {
      question: "How do I track task progress?",
      answer: "Tasks can be managed from the Tasks page. You can update task status, add notes, and set due dates. Use the status filters to view tasks by their current state."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export your contacts, jobs, and tasks data. Go to Settings > Data Export to download your information in various formats."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
    },
    {
      question: "How do I change my notification settings?",
      answer: "Go to your Profile dropdown menu and select 'Notifications'. From there, you can customize how and when you receive notifications."
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Find answers and get help with EkoSolar CRM</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">User Guide</h3>
              <p className="text-sm text-muted-foreground">Comprehensive documentation</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Step-by-step video guides</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold">Release Notes</h3>
              <p className="text-sm text-muted-foreground">Latest updates and features</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border bg-muted/20">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredFaqs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No FAQs found matching your search.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Methods */}
              <div className="grid gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 9 AM - 5 PM EST</p>
                  </div>
                  <Button size="sm" className="ml-auto">Chat Now</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@ekosolarpros.com</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">Send Email</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">Call Now</Button>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                <h3 className="font-semibold border-t border-border pt-4">Send us a message</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => handleContactFormChange('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactFormChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => handleContactFormChange('subject', e.target.value)}
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={contactForm.priority}
                    onChange={(e) => handleContactFormChange('priority', e.target.value)}
                    className="w-full h-10 px-3 border border-border rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                    placeholder="Please describe your issue or question in detail..."
                    rows={5}
                  />
                </div>

                <Button className="w-full">Send Message</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of EkoSolar CRM services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">API Services</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Database</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Email Notifications</span>
              </div>
              <span className="text-sm text-yellow-600">Partial Outage</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">File Storage</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
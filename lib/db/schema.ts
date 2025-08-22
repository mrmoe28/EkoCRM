import { integer, text, sqliteTable, real } from 'drizzle-orm/sqlite-core'
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  company: text('company'),
  notes: text('notes'),
  status: text('status', { enum: ['lead', 'prospect', 'customer', 'inactive'] }).default('lead'),
  createdAt: text('created_at').default("datetime('now')"),
  updatedAt: text('updated_at').default("datetime('now')")
})

export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  contactId: integer('contact_id').references(() => contacts.id),
  status: text('status', { 
    enum: ['quoted', 'approved', 'in_progress', 'completed', 'cancelled'] 
  }).default('quoted'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  estimatedValue: real('estimated_value'),
  actualValue: real('actual_value'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  completedDate: text('completed_date'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  notes: text('notes'),
  createdAt: text('created_at').default("datetime('now')"),
  updatedAt: text('updated_at').default("datetime('now')")
})

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  jobId: integer('job_id').references(() => jobs.id),
  contactId: integer('contact_id').references(() => contacts.id),
  assignedTo: text('assigned_to'),
  status: text('status', { 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'] 
  }).default('pending'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  dueDate: text('due_date'),
  completedDate: text('completed_date'),
  estimatedHours: real('estimated_hours'),
  actualHours: real('actual_hours'),
  notes: text('notes'),
  createdAt: text('created_at').default("datetime('now')"),
  updatedAt: text('updated_at').default("datetime('now')")
})

export const schedules = sqliteTable('schedules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  jobId: integer('job_id').references(() => jobs.id),
  taskId: integer('task_id').references(() => tasks.id),
  contactId: integer('contact_id').references(() => contacts.id),
  assignedTo: text('assigned_to'),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  date: text('date').notNull(),
  location: text('location'),
  type: text('type', { 
    enum: ['site_visit', 'installation', 'maintenance', 'consultation', 'follow_up'] 
  }).default('site_visit'),
  status: text('status', { 
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'] 
  }).default('scheduled'),
  notes: text('notes'),
  createdAt: text('created_at').default("datetime('now')"),
  updatedAt: text('updated_at').default("datetime('now')")
})

// Zod schemas for validation - temporarily disabled due to version conflict
// export const insertContactSchema = createInsertSchema(contacts)
// export const selectContactSchema = createSelectSchema(contacts)

// export const insertJobSchema = createInsertSchema(jobs)
// export const selectJobSchema = createSelectSchema(jobs)

// export const insertTaskSchema = createInsertSchema(tasks)
// export const selectTaskSchema = createSelectSchema(tasks)

// export const insertScheduleSchema = createInsertSchema(schedules)
// export const selectScheduleSchema = createSelectSchema(schedules)

export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert

export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export type Schedule = typeof schedules.$inferSelect
export type NewSchedule = typeof schedules.$inferInsert
import { integer, text, pgTable, real, timestamp, uuid } from 'drizzle-orm/pg-core'
// import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  company: text('company'),
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const contacts = pgTable('contacts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').references(() => users.id),
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const jobs = pgTable('jobs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').references(() => users.id),
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const tasks = pgTable('tasks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').references(() => users.id),
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const schedules = pgTable('schedules', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').references(() => users.id),
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
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

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert

export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert

export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export type Schedule = typeof schedules.$inferSelect
export type NewSchedule = typeof schedules.$inferInsert
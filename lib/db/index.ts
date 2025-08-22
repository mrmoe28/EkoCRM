import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Validate environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in production')
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

const client = postgres(connectionString, {
  prepare: false,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
})

export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development'
})

export * from './schema'

// Health check function for database connection
export async function checkDatabaseConnection() {
  try {
    await db.select().from(schema.contacts).limit(1)
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    }
  }
}
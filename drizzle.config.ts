import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

config({ path: '.env.local' })

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || '',
  },
  introspect: {
    casing: 'snake_case',
  },
  // Fix TypeScript target environment issue
  tsconfig: 'tsconfig.json',
  verbose: true,
  strict: true,
})
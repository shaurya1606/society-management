import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)
const migrationPath = 'drizzle/0000_motionless_johnny_blaze.sql'
const query = readFileSync(migrationPath, 'utf8')
const hash = createHash('sha256').update(query).digest('hex')

await sql`CREATE SCHEMA IF NOT EXISTS drizzle`
await sql`
  CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at bigint
  )
`

const existing = await sql`
  SELECT hash FROM drizzle.__drizzle_migrations WHERE hash = ${hash}
`
if (existing.length > 0) {
    console.log('0000 already baselined')
} else {
    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${hash}, ${Date.now()})
    `
    console.log('Baselined 0000_motionless_johnny_blaze')
}

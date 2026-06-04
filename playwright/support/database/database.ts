import 'dotenv/config'
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from './schema'

const CONNECT_TIMEOUT_MS = 15_000

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.CI ? 2 : 10,
  connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
  idleTimeoutMillis: 10_000,
  ssl: {
    rejectUnauthorized: false,
  },
})

const dialect = new PostgresDialect({ pool })

export const db = new Kysely<Database>({
  dialect,
})

export async function closeDatabase(): Promise<void> {
  await pool.end()
}

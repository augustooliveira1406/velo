import 'dotenv/config'
import pg from 'pg'
import { pingSupabaseAdmin, getSupabaseAdminConfig } from './support/database/supabaseAdmin'
import { resolveDatabaseUrl } from './support/database/database'

const CONNECT_TIMEOUT_MS = 15_000

async function pingPostgres(): Promise<void> {
  const connectionString = resolveDatabaseUrl()
  if (!connectionString) return

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
  })

  try {
    await client.connect()
    await client.query('SELECT 1')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Postgres (${CONNECT_TIMEOUT_MS}ms): ${message}`)
  } finally {
    await client.end()
  }
}

export default async function globalSetup() {
  if (getSupabaseAdminConfig()) {
    await pingSupabaseAdmin()
    return
  }

  const connectionString = resolveDatabaseUrl()
  if (connectionString) {
    await pingPostgres()
    return
  }
}

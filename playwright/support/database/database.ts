import '../loadEnv'
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from './schema'

const CONNECT_TIMEOUT_MS = 15_000

/**
 * Ajusta a URI para o pooler transacional do Supabase (porta 6543).
 * Pool persistente + PgBouncer em modo transaction costuma derrubar conexões no meio do teste.
 */
export function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim() ?? ''
  if (!raw) return ''

  if (raw.includes(':6543') && !raw.includes('pgbouncer=')) {
    const separator = raw.includes('?') ? '&' : '?'
    return `${raw}${separator}pgbouncer=true`
  }

  return raw
}

export async function withDatabase<T>(fn: (db: Kysely<Database>) => Promise<T>): Promise<T> {
  const connectionString = resolveDatabaseUrl()
  const pool = new pg.Pool({
    connectionString,
    max: 1,
    min: 0,
    idleTimeoutMillis: 1,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
    ssl: { rejectUnauthorized: false },
  })

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  })

  try {
    return await fn(db)
  } finally {
    await pool.end()
  }
}

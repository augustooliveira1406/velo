import 'dotenv/config'
import pg from 'pg'
import { resolveDatabaseUrl } from './support/database/database'

const CONNECT_TIMEOUT_MS = 15_000

export default async function globalSetup() {
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
    throw new Error(
      `Não foi possível conectar ao Postgres em ${CONNECT_TIMEOUT_MS}ms (${message}). ` +
        'Use PREVIEW_DATABASE_URL do pooler Supabase. Preferível: Session pooler (porta 5432 em *.pooler.supabase.com). ' +
        'Se usar Transaction pooler (6543), a URI deve ser a do painel com host pooler.',
    )
  } finally {
    await client.end()
  }
}

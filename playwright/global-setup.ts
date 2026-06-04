import 'dotenv/config'
import pg from 'pg'

const CONNECT_TIMEOUT_MS = 15_000

export default async function globalSetup() {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) return

  const client = new pg.Client({
    connectionString: url,
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
        'No GitHub Actions use PREVIEW_DATABASE_URL com o pooler Supabase (host *.pooler.supabase.com, porta 6543), ' +
        'não a conexão direta db.*.supabase.co:5432.',
    )
  } finally {
    await client.end()
  }
}

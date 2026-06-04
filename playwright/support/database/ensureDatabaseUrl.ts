import { getSupabaseAdminConfig } from './supabaseAdmin'
import { resolveDatabaseUrl } from './database'

export function ensureTestDatabaseAccess(): void {
  if (getSupabaseAdminConfig()) return
  if (resolveDatabaseUrl()) return

  throw new Error(
    'Configure o banco dos testes E2E com uma das opções:\n' +
      '  • CI/recomendado: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (secrets PREVIEW_SUPABASE_URL e PREVIEW_SUPABASE_SERVICE_ROLE_KEY)\n' +
      '  • Local alternativo: DATABASE_URL (Postgres; Session pooler em *.pooler.supabase.com:5432)',
  )
}

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { loadTestEnv } from '../loadEnv'

loadTestEnv()

function assertServiceRoleKey(key: string): void {
  const trimmed = key.trim()

  if (trimmed.startsWith('sb_publishable_')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY parece ser a chave publishable (sb_publishable_...). ' +
        'No GitHub, o secret PREVIEW_SUPABASE_SERVICE_ROLE_KEY deve ser a service_role ' +
        '(Supabase → Project Settings → API → service_role → Reveal).',
    )
  }

  if (trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY parece ser DATABASE_URL (connection string). ' +
        'Use a API key service_role, não a senha/URI do Postgres.',
    )
  }

  if (trimmed.length < 20) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY está vazia ou incompleta no secret do GitHub.')
  }
}

export function getSupabaseAdminConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !serviceRoleKey) return null

  assertServiceRoleKey(serviceRoleKey)
  return { url, serviceRoleKey }
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const config = getSupabaseAdminConfig()
  if (!config) return null

  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function pingSupabaseAdmin(): Promise<void> {
  const config = getSupabaseAdminConfig()
  if (!config) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no CI.')
  }

  const supabase = getSupabaseAdmin()!
  const { error } = await supabase.from('orders').select('id').limit(1)

  if (error) {
    const hint =
      error.message === 'Invalid API key'
        ? ' Confira se PREVIEW_SUPABASE_SERVICE_ROLE_KEY é a service_role do MESMO projeto de PREVIEW_SUPABASE_URL (não use publishable nem senha do banco).'
        : ''
    throw new Error(`Supabase API: ${error.message}.${hint}`)
  }
}

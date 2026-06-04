import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function getSupabaseAdminConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !serviceRoleKey) return null
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
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.')
  }

  const { error } = await supabase.from('orders').select('id').limit(1)
  if (error) {
    throw new Error(`Supabase API: ${error.message}`)
  }
}

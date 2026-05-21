import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side admin client.
 * Uses SERVICE_ROLE_KEY → bypasses Row Level Security.
 * NEVER import this from client components.
 */
let _admin: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: 'no-store' }),
    },
  })
  return _admin
}

/**
 * Helper — capture a partial lead at any moment (e.g. when user enters email).
 * Used for funnel analytics: who reached step N but didn't pay.
 */
export async function upsertLead(payload: {
  email: string
  partial_form?: Record<string, unknown>
  source?: string
}) {
  return supabaseAdmin()
    .from('leads')
    .upsert(
      {
        email: payload.email.toLowerCase().trim(),
        partial_form: payload.partial_form ?? {},
        source: payload.source ?? 'form',
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'email' },
    )
}

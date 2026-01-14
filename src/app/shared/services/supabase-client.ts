import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Centralised Supabase client factory.
 *
 * Reads configuration from global environment variables when available
 * (e.g. injected at build/deploy time), and falls back to the current
 * project defaults so local development keeps working.
 *
 * In production, set:
 * - NG_APP_SUPABASE_URL
 * - NG_APP_SUPABASE_ANON_KEY
 */
const SUPABASE_URL: string =
  (globalThis as any).NG_APP_SUPABASE_URL ?? 'https://vkllskiarxtcwedrwrys.supabase.co';

const SUPABASE_ANON_KEY: string =
  (globalThis as any).NG_APP_SUPABASE_ANON_KEY ?? 'sb_publishable_LAhbVtMIVk4b861pyPZkiw_UQAO4Exp';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return cachedClient;
}



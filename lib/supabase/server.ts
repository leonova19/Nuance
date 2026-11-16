import { createClient } from '@supabase/supabase-js';

const noSessionAuth = {
  autoRefreshToken: false,
  persistSession: false,
  detectSessionInUrl: false,
};

function fetchWithoutCache(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, { ...init, cache: 'no-store' });
}

export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: noSessionAuth,
    global: { fetch: fetchWithoutCache },
  });
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}


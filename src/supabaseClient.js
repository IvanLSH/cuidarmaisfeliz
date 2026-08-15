import { createClient } from '@supabase/supabase-js';

// Sanitize URL to avoid "Invalid path specified in request URL" errors
let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/['"]/g, '');
let rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim().replace(/['"]/g, '');

if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}
if (rawUrl.endsWith('/rest/v1')) {
  rawUrl = rawUrl.replace('/rest/v1', '');
}
if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}`;
}

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('your-supabase-url') &&
  !rawKey.includes('your-anon-key')
);

export const supabase = createClient(
  isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? rawKey : 'placeholder-key'
);

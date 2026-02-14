import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Lazy-loaded browser client to avoid issues during SSR if env vars are missing
let browserClient: any = null;

export const getSupabaseBrowserClient = () => {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Supabase environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing!');
    throw new Error('Supabase configuration missing');
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  return browserClient;
};

// Also export the constant for compatibility but note it might be problematic if evaluated too early
export const supabase = typeof window !== 'undefined'
  ? createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  : null as any;

// Admin Supabase client with service role (bypass RLS - use only on server)
export const getSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase Admin configuration missing');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Legacy exports for backward compatibility if needed
export const supabaseAdmin = typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  : null as any;




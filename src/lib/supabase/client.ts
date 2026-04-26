/**
 * NUMERIQ.AI - Supabase Clients
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

// Client for use in the browser (syncs auth to cookies automatically)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Wrapper for components that expect createClient()
export const createClient = () => supabase;

// Helper for server-side operations (requires Service Role Key)
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

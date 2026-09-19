import { createClient } from '@supabase/supabase-js';
import { validateSupabaseConfig } from './supabaseConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigurationError = validateSupabaseConfig(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = !supabaseConfigurationError;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

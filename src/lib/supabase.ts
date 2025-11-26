/**
 * Supabase client configuration
 * Centralized client creation for both anon and service role access
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Public Supabase client (anon key)
 * Safe to use in both client and server components
 * Has row-level security (RLS) restrictions
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Admin Supabase client (service role key)
 * SERVER-SIDE ONLY - Never import in client components!
 * Bypasses row-level security - use with caution
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

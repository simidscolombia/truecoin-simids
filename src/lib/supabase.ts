import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing!");
}

// Singleton instances
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});

// Admin client only if service role is present
export const supabaseAdmin = supabaseServiceRole
    ? createClient(supabaseUrl, supabaseServiceRole, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
    : supabase;

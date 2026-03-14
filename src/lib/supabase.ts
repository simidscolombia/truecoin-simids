import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceRole
    ? createClient(supabaseUrl, supabaseServiceRole)
    : supabase;

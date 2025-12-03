
import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from Vite environment variables.
// For local development create a `.env.local` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
	// eslint-disable-next-line no-console
	console.warn('Supabase URL or Key not found in environment variables. Create `.env.local` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

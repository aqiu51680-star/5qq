
import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from Vite environment variables.
// For local development create a `.env.local` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
	// eslint-disable-next-line no-console
	console.warn('Supabase URL or Key not found in environment variables. Create `.env.local` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

let _supabase: any = null;
if (isSupabaseConfigured) {
	_supabase = createClient(supabaseUrl, supabaseKey);
} else {
	// Provide a lightweight stub so imports don't immediately crash. Any call will throw a clear error.
	const handler = {
		get() {
			throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
		}
	};
	_supabase = new Proxy({}, handler);
}

export const supabase = _supabase;

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars')
  process.exit(1)
}

const supabase = createClient(url, key)

console.log('[listener] connecting to', url)

const channel = supabase
  .channel('public:app_content')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'app_content' }, (payload) => {
    console.log('[listener] postgres change:', payload.eventType, payload)
  })
  .subscribe((status) => {
    console.log('[listener] subscription status:', status)
  })

// keep process alive
process.stdin.resume()

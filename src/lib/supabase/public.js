import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from './env';

// Klijent za javne stranice: bez prijave, vidi samo objavljen sadržaj.
// Ne čita kolačiće, pa stranice mogu da se keširaju i budu brze.
let klijent = null;

export function javniKlijent() {
  if (!klijent) {
    klijent = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return klijent;
}

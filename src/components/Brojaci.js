'use client';

import { useEffect } from 'react';
import { imaSupabase } from '@/lib/supabase/env';
import { browserKlijent } from '@/lib/supabase/browser';

// Nevidljivi brojači: pregled vesti i prikaz reklame (jednom po poseti).
function jednomPoPoseti(kljuc) {
  try {
    if (sessionStorage.getItem(kljuc)) return false;
    sessionStorage.setItem(kljuc, '1');
  } catch {
    // privatni režim: brojimo svejedno
  }
  return true;
}

export function BrojacPregleda({ slug }) {
  useEffect(() => {
    if (!imaSupabase || !slug || !jednomPoPoseti(`pv:${slug}`)) return;
    browserKlijent().rpc('zabelezi_pregled', { p_slug: slug }).then(() => {}, () => {});
  }, [slug]);
  return null;
}

export function BrojacPrikaza({ id }) {
  useEffect(() => {
    if (!imaSupabase || !id || !jednomPoPoseti(`ad:${id}`)) return;
    browserKlijent().rpc('zabelezi_prikaz', { p_id: id }).then(() => {}, () => {});
  }, [id]);
  return null;
}

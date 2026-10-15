import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_KEY } from './env';

// Klijent za CMS na serveru: zna ko je prijavljen (preko kolačića).
export async function serverKlijent() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(lista) {
        try {
          lista.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Pozvano iz stranice (ne iz akcije): kolačiće osvežava middleware.
        }
      },
    },
  });
}

// Vraća { sb, user, admin } — koristi se u svakoj CMS stranici i akciji.
export async function proveriAdmina() {
  const sb = await serverKlijent();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { sb, user: null, admin: false };
  const { data } = await sb.rpc('je_admin');
  return { sb, user, admin: data === true };
}

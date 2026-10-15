'use server';

import { imaSupabase } from '@/lib/supabase/env';
import { javniKlijent } from '@/lib/supabase/public';
import { KATEGORIJE_OGLASA } from '@/lib/konstante';

const tekst = (fd, k, max) => String(fd.get(k) ?? '').trim().slice(0, max);

// Građanin predaje oglas → ide u CMS na odobravanje (Mali oglasi → Na čekanju).
export async function predajOglas(_prev, fd) {
  if (tekst(fd, 'web', 50)) return { ok: true }; // zamka za botove
  if (!imaSupabase) return { greska: 'Predaja oglasa biće dostupna kada se poveže baza.' };

  const oglas = {
    kategorija: tekst(fd, 'kategorija', 60),
    naslov: tekst(fd, 'naslov', 120),
    opis: tekst(fd, 'opis', 3000),
    cena: tekst(fd, 'cena', 40),
    mesto: tekst(fd, 'mesto', 60),
    ime: tekst(fd, 'ime', 80),
    telefon: tekst(fd, 'telefon', 40),
    email: tekst(fd, 'email', 120),
    slika_url: tekst(fd, 'slika_url', 500) || null,
    status: 'na_cekanju',
  };

  if (!KATEGORIJE_OGLASA.includes(oglas.kategorija)) return { greska: 'Izaberi kategoriju.', vrednosti: oglas };
  if (oglas.naslov.length < 5) return { greska: 'Naslov je prekratak.', vrednosti: oglas };
  if (!oglas.telefon && !oglas.email) return { greska: 'Ostavi telefon ili email da bi te kupci kontaktirali.', vrednosti: oglas };
  if (oglas.slika_url && !oglas.slika_url.includes('/storage/v1/object/public/slike/oglasi/')) oglas.slika_url = null;

  const { error } = await javniKlijent().from('oglasi').insert(oglas);
  if (error) {
    console.error('[oglas]', error.message);
    return { greska: 'Slanje nije uspelo. Pokušaj ponovo za par minuta.', vrednosti: oglas };
  }
  return { ok: true };
}

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_KEY } from './env';

// Klijent u pregledaču: prijava u CMS, otpremanje slika, brojači.
let klijent = null;

export function browserKlijent() {
  if (!klijent) klijent = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  return klijent;
}

// Otprema sliku u Supabase Storage i vraća javni link.
export async function otpremiSliku(fajl, folder = 'ostalo') {
  if (!fajl.type.startsWith('image/')) throw new Error('Izaberi sliku (JPG, PNG, WEBP ili GIF).');
  if (fajl.size > 5 * 1024 * 1024) throw new Error('Slika je veća od 5 MB. Smanji je pa pokušaj ponovo.');
  const ext = (fajl.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const putanja = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const sb = browserKlijent();
  const { error } = await sb.storage.from('slike').upload(putanja, fajl, { cacheControl: '31536000', upsert: false });
  if (error) throw new Error(`Otpremanje nije uspelo: ${error.message}`);
  return sb.storage.from('slike').getPublicUrl(putanja).data.publicUrl;
}

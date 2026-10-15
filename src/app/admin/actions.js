'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { proveriAdmina } from '@/lib/supabase/server';
import { SEKCIJE, PODESAVANJA } from '@/lib/cms';
import { napraviSlug } from '@/lib/slug';
import { lokalnoUIso, danasISO, dodajDane } from '@/lib/format';

const NEMA_PRISTUPA = { greska: 'Nisi prijavljen kao administrator. Prijavi se ponovo.' };

function osveziSajt() {
  revalidatePath('/', 'layout');
}

const dodajHttps = (s) => (s && !/^(https?:|mailto:|tel:|\/)/i.test(s) ? `https://${s}` : s);

function citajPolje(p, fd) {
  const sirovo = fd.get(p.ime);
  const s = typeof sirovo === 'string' ? sirovo.trim() : '';
  switch (p.tip) {
    case 'url': return s === '' ? null : dodajHttps(s);
    case 'checkbox': return sirovo === 'on';
    case 'number': return s === '' ? (p.podrazumevano ?? 0) : Number(s);
    case 'datetime': return lokalnoUIso(s) ?? new Date().toISOString();
    case 'galerija':
      try {
        const lista = JSON.parse(s || '[]');
        return Array.isArray(lista) ? lista.filter((x) => typeof x === 'string' && x) : [];
      } catch {
        return [];
      }
    default: return s === '' ? null : (p.max ? s.slice(0, p.max) : s);
  }
}

// Čuva novi ili izmenjeni zapis bilo koje sekcije.
export async function sacuvaj(sekcija, id, fd) {
  const cfg = SEKCIJE[sekcija];
  if (!cfg) return { greska: 'Nepoznata sekcija.' };
  const { sb, admin } = await proveriAdmina();
  if (!admin) return NEMA_PRISTUPA;

  const red = {};
  for (const p of cfg.polja) red[p.ime] = citajPolje(p, fd);

  for (const p of cfg.polja) {
    if (p.tip === 'slug') red[p.ime] = napraviSlug(red[p.ime] || red[p.izvor] || '');
    if (p.obavezno && (red[p.ime] === null || red[p.ime] === '')) {
      return { greska: `Polje „${p.naslov}" je obavezno.` };
    }
    if (p.tip === 'slug' && !red[p.ime]) return { greska: `Polje „${p.naslov}" ne može biti prazno.` };
  }

  if (cfg.tabela === 'oglasi' && !red.istice) red.istice = dodajDane(danasISO(), 30);
  if (cfg.tabela === 'vesti') red.updated_at = new Date().toISOString();

  const kljuc = cfg.kljuc ?? 'id';
  const upit = id === 'novo'
    ? sb.from(cfg.tabela).insert(red).select(kljuc).single()
    : sb.from(cfg.tabela).update(red).eq(kljuc, id).select(kljuc).single();
  const { error } = await upit;

  if (error) {
    if (error.code === '23505') return { greska: 'Ta adresa (slug) je već zauzeta. Promeni je i sačuvaj ponovo.' };
    if (error.code === '23514') return { greska: 'Neka vrednost nije dozvoljena (npr. adresa sme da ima samo mala slova, brojeve i crtice).' };
    console.error('[cms sacuvaj]', error);
    return { greska: `Čuvanje nije uspelo: ${error.message}` };
  }

  osveziSajt();
  redirect(`/admin/${sekcija}?poruka=sacuvano`);
}

export async function obrisi(sekcija, id) {
  const cfg = SEKCIJE[sekcija];
  const { sb, admin } = await proveriAdmina();
  if (!cfg || !admin) return;
  const { error } = await sb.from(cfg.tabela).delete().eq(cfg.kljuc ?? 'id', id);
  if (error) {
    console.error('[cms obrisi]', error);
    redirect(`/admin/${sekcija}?poruka=greska`);
  }
  osveziSajt();
  redirect(`/admin/${sekcija}?poruka=obrisano`);
}

// Odobri / odbij oglas ili komentar
export async function postaviStatus(sekcija, id, status) {
  const cfg = SEKCIJE[sekcija];
  const { sb, admin } = await proveriAdmina();
  if (!cfg?.moderacija || !admin) return;
  const izmena = { status };
  if (cfg.tabela === 'oglasi' && status === 'odobren') izmena.istice = dodajDane(danasISO(), 30);
  await sb.from(cfg.tabela).update(izmena).eq('id', id);
  osveziSajt();
}

// Firma platila → produži „Plaćeno do" (od danas ili od starog datuma, šta je kasnije)
export async function produziFirmu(id, dana = 30) {
  const { sb, admin } = await proveriAdmina();
  if (!admin) return;
  const { data } = await sb.from('firme').select('placeno_do').eq('id', id).maybeSingle();
  const danas = danasISO();
  const od = data?.placeno_do && data.placeno_do > danas ? data.placeno_do : danas;
  await sb.from('firme').update({ placeno_do: dodajDane(od, dana), aktivna: true }).eq('id', id);
  osveziSajt();
}

export async function sacuvajPodesavanja(fd) {
  const { sb, admin } = await proveriAdmina();
  if (!admin) return NEMA_PRISTUPA;
  const redovi = PODESAVANJA.map((p) => {
    const v = String(fd.get(p.ime) ?? '').trim();
    return { kljuc: p.ime, vrednost: p.tip === 'url' ? dodajHttps(v) : v };
  });
  const { error } = await sb.from('podesavanja').upsert(redovi, { onConflict: 'kljuc' });
  if (error) return { greska: `Čuvanje nije uspelo: ${error.message}` };
  osveziSajt();
  return { ok: 'Podešavanja su sačuvana.' };
}

export async function odjava() {
  const { sb } = await proveriAdmina();
  await sb.auth.signOut();
  redirect('/admin/prijava');
}

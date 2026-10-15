// Sve što javni sajt čita iz baze. Dok Supabase nije povezan, vraća probne podatke.
import { cache } from 'react';
import { imaSupabase } from './supabase/env';
import { javniKlijent } from './supabase/public';
import * as demo from './data';
import { danasISO } from './format';

const KOLONE_VESTI = 'id,slug,naslov,uvod,rubrika,tema,slika_url,istaknuto,preporuceno,datum,pregledi';
const RANG_PAKETA = { premium: 0, standard: 1, osnovni: 2 };

// Izvršava upit; ako baza nije povezana vraća probne podatke,
// a ako upit ne uspe vraća praznu vrednost (nikad lažne vesti na živom sajtu).
async function upit(fn, probno, prazno) {
  if (!imaSupabase) return probno();
  try {
    const { data, error } = await fn(javniKlijent());
    if (error) throw error;
    return data ?? prazno;
  } catch (e) {
    console.error('[baza]', e?.message ?? e);
    return prazno;
  }
}

const sadaISO = () => new Date().toISOString();
const poDatumu = (a, b) => new Date(b.datum) - new Date(a.datum);
const objavljeneDemo = () => [...demo.vesti].sort(poDatumu);

// Tekst vesti: prazan red u CMS-u = novi pasus
export function pasusi(tekst) {
  return String(tekst ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

function osnovaVesti(sb) {
  return sb.from('vesti').select(KOLONE_VESTI).eq('status', 'objavljeno').lte('datum', sadaISO());
}

// ---------------- Podešavanja i rubrike ----------------

export const getPodesavanja = cache(async () => {
  const redovi = await upit(
    (sb) => sb.from('podesavanja').select('kljuc,vrednost'),
    () => Object.entries(demo.podesavanja).map(([kljuc, vrednost]) => ({ kljuc, vrednost })),
    [],
  );
  const p = { ...Object.fromEntries(Object.keys(demo.podesavanja).map((k) => [k, ''])) };
  redovi.forEach((r) => { p[r.kljuc] = r.vrednost ?? ''; });
  return p;
});

export const getRubrike = cache(async () => upit(
  (sb) => sb.from('rubrike').select('slug,naziv,redosled').order('redosled'),
  () => demo.rubrike,
  [],
));

export async function nazivRubrike(slug) {
  const r = (await getRubrike()).find((x) => x.slug === slug);
  return r?.naziv ?? '';
}

// Traka „Najnovije": iz podešavanja, a ako je prazno — naslovi poslednjih vesti
export async function getTicker() {
  const p = await getPodesavanja();
  const redovi = String(p.ticker ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
  if (redovi.length) return redovi;
  return (await getNajnovije(3)).map((v) => v.naslov);
}

// ---------------- Vesti ----------------

export async function getIstaknute() {
  const v = await upit(
    (sb) => osnovaVesti(sb).eq('istaknuto', true).order('datum', { ascending: false }).limit(5),
    () => objavljeneDemo().filter((x) => x.istaknuto).slice(0, 4),
    [],
  );
  // Ako ništa nije označeno za karusel, prikaži 4 najnovije
  return v.length ? v : getNajnovije(4);
}

export async function getNajnovije(limit = 6, preskoci = []) {
  const v = await upit(
    (sb) => osnovaVesti(sb).order('datum', { ascending: false }).limit(limit + preskoci.length),
    () => objavljeneDemo(),
    [],
  );
  return v.filter((x) => !preskoci.includes(x.slug)).slice(0, limit);
}

export async function getVest(slug) {
  if (!imaSupabase) return demo.vesti.find((v) => v.slug === slug) ?? null;
  return upit(
    (sb) => sb.from('vesti').select('*').eq('slug', slug).eq('status', 'objavljeno').lte('datum', sadaISO()).maybeSingle(),
    () => null,
    null,
  );
}

export async function getVestiRubrike(rubrika, strana = 1, poStrani = 12) {
  const od = (strana - 1) * poStrani;
  if (!imaSupabase) {
    const sve = objavljeneDemo().filter((v) => v.rubrika === rubrika);
    return { vesti: sve.slice(od, od + poStrani), ukupno: sve.length };
  }
  try {
    const { data, count, error } = await javniKlijent()
      .from('vesti').select(KOLONE_VESTI, { count: 'exact' })
      .eq('status', 'objavljeno').lte('datum', sadaISO()).eq('rubrika', rubrika)
      .order('datum', { ascending: false }).range(od, od + poStrani - 1);
    if (error) throw error;
    return { vesti: data ?? [], ukupno: count ?? 0 };
  } catch (e) {
    console.error('[baza]', e?.message ?? e);
    return { vesti: [], ukupno: 0 };
  }
}

export async function getNajcitanije(limit = 5) {
  const pre30 = new Date(Date.now() - 30 * 864e5).toISOString();
  const v = await upit(
    (sb) => osnovaVesti(sb).gte('datum', pre30).order('pregledi', { ascending: false }).limit(limit),
    () => [...demo.vesti].sort((a, b) => b.pregledi - a.pregledi).slice(0, limit),
    [],
  );
  return v.length ? v : getNajnovije(limit);
}

export async function getPreporucena() {
  const v = await upit(
    (sb) => osnovaVesti(sb).eq('preporuceno', true).order('datum', { ascending: false }).limit(1),
    () => demo.vesti.filter((x) => x.preporuceno),
    [],
  );
  return v[0] ?? (await getNajnovije(1))[0] ?? null;
}

export async function getPovezane(vest, limit = 3) {
  if (!vest?.rubrika) return [];
  return upit(
    (sb) => osnovaVesti(sb).eq('rubrika', vest.rubrika).neq('slug', vest.slug).order('datum', { ascending: false }).limit(limit),
    () => objavljeneDemo().filter((v) => v.rubrika === vest.rubrika && v.slug !== vest.slug).slice(0, limit),
    [],
  );
}

export async function getKomentari(vestId) {
  if (!imaSupabase) return [];
  return upit(
    (sb) => sb.from('komentari').select('id,ime,tekst,created_at').eq('vest_id', vestId).eq('status', 'odobren').order('created_at'),
    () => [],
    [],
  );
}

// ---------------- Aktuelno (teme) ----------------

export async function getTeme() {
  return upit(
    (sb) => sb.from('teme').select('slug,naslov,opis').eq('aktivna', true).order('redosled'),
    () => demo.teme,
    [],
  );
}

export async function getVestiTema() {
  const teme = await getTeme();
  const slugovi = teme.map((t) => t.slug);
  if (!slugovi.length) return [];
  const vesti = await upit(
    (sb) => osnovaVesti(sb).in('tema', slugovi).order('datum', { ascending: false }).limit(200),
    () => objavljeneDemo().filter((v) => v.tema),
    [],
  );
  return teme.map((t) => ({ ...t, vesti: vesti.filter((v) => v.tema === t.slug) }));
}

// ---------------- Firme ----------------

export async function getFirme(kategorija) {
  const f = await upit(
    (sb) => {
      let q = sb.from('firme').select('id,slug,naziv,kategorija,kratak_opis,logo_url,paket,adresa,telefon').order('naziv');
      if (kategorija) q = q.eq('kategorija', kategorija);
      return q;
    },
    () => demo.firme.filter((x) => !kategorija || x.kategorija === kategorija),
    [],
  );
  return [...f].sort((a, b) => (RANG_PAKETA[a.paket] ?? 9) - (RANG_PAKETA[b.paket] ?? 9));
}

export async function getFirma(slug) {
  if (!imaSupabase) return demo.firme.find((f) => f.slug === slug) ?? null;
  return upit((sb) => sb.from('firme').select('*').eq('slug', slug).maybeSingle(), () => null, null);
}

// ---------------- Reklame ----------------

// Sve aktivne reklame, grupisane po mestu na sajtu
export const getReklame = cache(async () => {
  const r = await upit(
    (sb) => sb.from('reklame').select('id,pozicija,slika_url,video_url,naslov,link_url,firma:firme(slug,naziv,logo_url)'),
    () => [],
    [],
  );
  const po = {};
  r.forEach((x) => { (po[x.pozicija] ??= []).push(x); });
  return po;
});

// Nasumično bira jednu reklamu za dato mesto (rotacija između firmi)
export async function reklama(pozicija) {
  const lista = (await getReklame())[pozicija] ?? [];
  return lista.length ? lista[Math.floor(Math.random() * lista.length)] : null;
}

// ---------------- Mali oglasi ----------------

export async function getOglasi({ kategorija, strana = 1, poStrani = 24 } = {}) {
  const od = (strana - 1) * poStrani;
  if (!imaSupabase) {
    const sve = demo.oglasi.filter((o) => !kategorija || o.kategorija === kategorija);
    return { oglasi: sve.slice(od, od + poStrani), ukupno: sve.length };
  }
  try {
    let q = javniKlijent().from('oglasi').select('id,kategorija,naslov,cena,mesto,slika_url,created_at', { count: 'exact' })
      .eq('status', 'odobren').gte('istice', danasISO());
    if (kategorija) q = q.eq('kategorija', kategorija);
    const { data, count, error } = await q.order('created_at', { ascending: false }).range(od, od + poStrani - 1);
    if (error) throw error;
    return { oglasi: data ?? [], ukupno: count ?? 0 };
  } catch (e) {
    console.error('[baza]', e?.message ?? e);
    return { oglasi: [], ukupno: 0 };
  }
}

export async function getOglas(id) {
  if (!imaSupabase) return demo.oglasi.find((o) => o.id === id) ?? null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return upit((sb) => sb.from('oglasi').select('*').eq('id', id).maybeSingle(), () => null, null);
}

// ---------------- Servis ----------------

export async function getServis() {
  const s = await upit(
    (sb) => sb.from('servis').select('id,tip,naslov,tekst,slika_url,datum').order('datum', { ascending: false }).limit(200),
    () => [],
    [],
  );
  const po = { struja_voda: [], putevi: [], red_voznje: [], citulje: [] };
  s.forEach((x) => po[x.tip]?.push(x));
  return po;
}

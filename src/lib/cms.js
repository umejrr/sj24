// =====================================================================
// CMS — opis svih sekcija administracije.
// Svaka sekcija = jedna tabela u bazi. Polja ovde određuju formu za unos,
// a kolone određuju tabelu u listi. Dodavanje polja: dodaj kolonu u bazu
// (supabase/schema.sql) i jedan red ovde.
// =====================================================================
import {
  KATEGORIJE_FIRMI, KATEGORIJE_OGLASA, PAKETI, POZICIJE_REKLAMA, SERVIS_TIPOVI,
  STATUS_MODERACIJE, STATUS_VESTI,
} from './konstante';

const kaoOpcije = (lista) => lista.map((x) => [x, x]);

export const GRUPE = [
  { naslov: 'Sadržaj', sekcije: ['vesti', 'teme', 'rubrike'] },
  { naslov: 'Zarada', sekcije: ['firme', 'reklame'] },
  { naslov: 'Zajednica', sekcije: ['oglasi', 'komentari'] },
  { naslov: 'Servis', sekcije: ['servis'] },
];

export const SEKCIJE = {
  // ------------------------------------------------------------- VESTI
  vesti: {
    tabela: 'vesti',
    naslov: 'Vesti',
    novo: 'Nova vest',
    opis: 'Sve vesti na portalu. Nacrt se ne vidi na sajtu dok ga ne objaviš.',
    red: ['datum', false],
    pretraga: 'naslov',
    filter: { polje: 'status', opcije: STATUS_VESTI },
    javniLink: (r) => `/vesti/${r.slug}`,
    kolone: [
      { polje: 'slika_url', tip: 'slika' },
      { polje: 'naslov', naslov: 'Naslov', glavna: true },
      { polje: 'rubrika', naslov: 'Rubrika' },
      { polje: 'status', naslov: 'Status', tip: 'status', opcije: STATUS_VESTI },
      { polje: 'istaknuto', naslov: 'Karusel', tip: 'bool' },
      { polje: 'datum', naslov: 'Datum', tip: 'datumVreme' },
      { polje: 'pregledi', naslov: 'Pregledi', tip: 'broj' },
    ],
    polja: [
      { ime: 'naslov', naslov: 'Naslov', tip: 'text', obavezno: true, max: 200 },
      { ime: 'uvod', naslov: 'Uvod (podnaslov)', tip: 'textarea', redova: 3, pomoc: 'Jedna ili dve rečenice. Prikazuju se u karuselu i ispod naslova.' },
      { ime: 'tekst', naslov: 'Tekst vesti', tip: 'textarea', redova: 18, pomoc: 'Prazan red između pasusa pravi novi pasus.' },
      { ime: 'slika_url', naslov: 'Glavna fotografija', tip: 'slika', folder: 'vesti' },
      { ime: 'slika_opis', naslov: 'Opis fotografije / autor', tip: 'text' },
      { ime: 'rubrika', naslov: 'Rubrika', tip: 'select', iz: { tabela: 'rubrike', vrednost: 'slug', labela: 'naziv', red: 'redosled' }, obavezno: true, pola: true },
      { ime: 'tema', naslov: 'Aktuelna tema', tip: 'select', iz: { tabela: 'teme', vrednost: 'slug', labela: 'naslov', red: 'redosled' }, prazno: '— bez teme —', pola: true },
      { ime: 'status', naslov: 'Status', tip: 'select', opcije: STATUS_VESTI, podrazumevano: 'nacrt', pola: true },
      { ime: 'datum', naslov: 'Datum i vreme objave', tip: 'datetime', pola: true, pomoc: 'Ako staviš budući datum, vest se sama pojavljuje tada.' },
      { ime: 'istaknuto', naslov: 'Prikaži u velikom karuselu na naslovnoj', tip: 'checkbox' },
      { ime: 'preporuceno', naslov: 'Prikaži kao „Preporučeno" u desnoj koloni', tip: 'checkbox' },
      { ime: 'autor', naslov: 'Autor', tip: 'text', podrazumevano: 'Redakcija SJ24', pola: true },
      { ime: 'slug', naslov: 'Adresa vesti', tip: 'slug', izvor: 'naslov', prefiks: 'sj24.com/vesti/', pola: true, pomoc: 'Ostavi prazno — napraviće se iz naslova.' },
    ],
  },

  // ------------------------------------------------------------- AKTUELNO
  teme: {
    tabela: 'teme',
    naslov: 'Aktuelno',
    novo: 'Nova tema',
    opis: 'Teme o kojima se priča danima. Vesti povezuješ sa temom u formi vesti (polje „Aktuelna tema").',
    red: ['redosled', true],
    javniLink: (r) => `/aktuelno#${r.slug}`,
    kolone: [
      { polje: 'naslov', naslov: 'Tema', glavna: true },
      { polje: 'aktivna', naslov: 'Na sajtu', tip: 'bool' },
      { polje: 'redosled', naslov: 'Redosled', tip: 'broj' },
    ],
    polja: [
      { ime: 'naslov', naslov: 'Naziv teme', tip: 'text', obavezno: true },
      { ime: 'opis', naslov: 'Kratak opis', tip: 'textarea', redova: 3 },
      { ime: 'aktivna', naslov: 'Prikaži na sajtu', tip: 'checkbox', podrazumevano: true },
      { ime: 'redosled', naslov: 'Redosled (manji broj = ranije)', tip: 'number', podrazumevano: 0, pola: true },
      { ime: 'slug', naslov: 'Adresa', tip: 'slug', izvor: 'naslov', prefiks: 'sj24.com/aktuelno#', pola: true },
    ],
  },

  // ------------------------------------------------------------- RUBRIKE
  rubrike: {
    tabela: 'rubrike',
    kljuc: 'slug',
    naslov: 'Rubrike',
    novo: 'Nova rubrika',
    opis: 'Rubrike u glavnom meniju (Sjenica, Pešter, Sport…).',
    red: ['redosled', true],
    javniLink: (r) => `/rubrika/${r.slug}`,
    kolone: [
      { polje: 'naziv', naslov: 'Rubrika', glavna: true },
      { polje: 'slug', naslov: 'Adresa' },
      { polje: 'redosled', naslov: 'Redosled', tip: 'broj' },
    ],
    polja: [
      { ime: 'naziv', naslov: 'Naziv', tip: 'text', obavezno: true },
      { ime: 'redosled', naslov: 'Redosled u meniju', tip: 'number', podrazumevano: 0, pola: true },
      { ime: 'slug', naslov: 'Adresa', tip: 'slug', izvor: 'naziv', prefiks: 'sj24.com/rubrika/', pola: true },
    ],
  },

  // ------------------------------------------------------------- FIRME
  firme: {
    tabela: 'firme',
    naslov: 'Firme i sponzori',
    novo: 'Nova firma',
    opis: 'Stranice firmi (firma.sj24.com) i imenik. Firma se sama sakriva kad prođe „Plaćeno do", a vraća čim produžiš datum.',
    red: ['naziv', true],
    pretraga: 'naziv',
    filter: { polje: 'paket', opcije: PAKETI },
    javniLink: (r) => `/firma/${r.slug}`,
    produzenje: true,
    kolone: [
      { polje: 'logo_url', tip: 'slika' },
      { polje: 'naziv', naslov: 'Firma', glavna: true },
      { polje: 'kategorija', naslov: 'Kategorija' },
      { polje: 'paket', naslov: 'Paket', tip: 'status', opcije: PAKETI },
      { polje: 'placeno_do', naslov: 'Plaćeno do', tip: 'placeno' },
    ],
    polja: [
      { ime: 'naziv', naslov: 'Naziv firme', tip: 'text', obavezno: true },
      { ime: 'slug', naslov: 'Poddomen', tip: 'slug', izvor: 'naziv', prefiks: 'https://', sufiks: '.sj24.com', pomoc: 'Samo mala slova, brojevi i crtice.' },
      { ime: 'kategorija', naslov: 'Kategorija', tip: 'select', opcije: kaoOpcije(KATEGORIJE_FIRMI), obavezno: true, pola: true },
      { ime: 'paket', naslov: 'Paket', tip: 'select', opcije: PAKETI, podrazumevano: 'osnovni', pola: true },
      { ime: 'placeno_do', naslov: 'Plaćeno do', tip: 'date', pola: true, pomoc: 'Prazno = uvek vidljivo.' },
      { ime: 'aktivna', naslov: 'Prikaži na sajtu', tip: 'checkbox', podrazumevano: true, pola: true },
      { ime: 'kratak_opis', naslov: 'Kratak opis (jedna rečenica)', tip: 'text', max: 200 },
      { ime: 'opis', naslov: 'Opis firme', tip: 'textarea', redova: 8 },
      { ime: 'logo_url', naslov: 'Logo', tip: 'slika', folder: 'firme', pola: true },
      { ime: 'naslovna_url', naslov: 'Naslovna fotografija', tip: 'slika', folder: 'firme', pola: true },
      { ime: 'galerija', naslov: 'Galerija slika', tip: 'galerija', folder: 'firme' },
      { ime: 'telefon', naslov: 'Telefon', tip: 'tel', pola: true },
      { ime: 'email', naslov: 'Email', tip: 'email', pola: true },
      { ime: 'adresa', naslov: 'Adresa (za mapu)', tip: 'text', pola: true },
      { ime: 'web', naslov: 'Sajt / Facebook stranica', tip: 'url', pola: true },
      { ime: 'radno_vreme', naslov: 'Radno vreme', tip: 'textarea', redova: 3, pomoc: 'npr. Pon–Pet 8–16 (svaki dan u novi red)' },
    ],
  },

  // ------------------------------------------------------------- REKLAME
  reklame: {
    tabela: 'reklame',
    naslov: 'Reklame',
    novo: 'Nova reklama',
    opis: 'Baneri na sajtu. Ako na istom mestu ima više reklama, smenjuju se nasumično. Brojimo prikaze i klikove.',
    red: ['created_at', false],
    pretraga: 'naziv',
    filter: { polje: 'pozicija', opcije: POZICIJE_REKLAMA },
    select: '*, firma:firme(naziv)',
    kolone: [
      { polje: 'slika_url', tip: 'slika' },
      { polje: 'naziv', naslov: 'Reklama', glavna: true },
      { polje: 'firma', naslov: 'Firma', prikaz: (r) => r.firma?.naziv ?? '—' },
      { polje: 'pozicija', naslov: 'Mesto', tip: 'opcija', opcije: POZICIJE_REKLAMA },
      { polje: 'aktivna', naslov: 'Aktivna', tip: 'bool' },
      { polje: 'prikazi', naslov: 'Prikazi', tip: 'broj' },
      { polje: 'klikovi', naslov: 'Klikovi', tip: 'broj' },
      { polje: 'ctr', naslov: 'CTR', prikaz: (r) => (r.prikazi ? `${((r.klikovi / r.prikazi) * 100).toFixed(1)}%` : '—') },
    ],
    polja: [
      { ime: 'naziv', naslov: 'Naziv (samo za tebe)', tip: 'text', obavezno: true, pomoc: 'npr. „Pekara X — oktobar"' },
      { ime: 'firma_id', naslov: 'Firma', tip: 'select', iz: { tabela: 'firme', vrednost: 'id', labela: 'naziv', red: 'naziv' }, prazno: '— bez firme —', pola: true },
      { ime: 'pozicija', naslov: 'Mesto na sajtu', tip: 'select', opcije: POZICIJE_REKLAMA, obavezno: true, pola: true },
      { ime: 'slika_url', naslov: 'Baner (slika)', tip: 'slika', folder: 'reklame', pomoc: 'Preporučene dimenzije su navedene uz mesto na sajtu.' },
      { ime: 'video_url', naslov: 'Video (link do .mp4, nije obavezno)', tip: 'url', pomoc: 'Video se pušta sam, bez zvuka. Slika iznad služi kao naslovna dok se učitava.' },
      { ime: 'naslov', naslov: 'Tekst (za sponzorisanu karticu)', tip: 'text' },
      { ime: 'link_url', naslov: 'Link (gde vodi klik)', tip: 'url', pomoc: 'Prazno = vodi na stranicu izabrane firme.' },
      { ime: 'vazi_od', naslov: 'Važi od', tip: 'date', pola: true },
      { ime: 'vazi_do', naslov: 'Važi do', tip: 'date', pola: true },
      { ime: 'aktivna', naslov: 'Aktivna', tip: 'checkbox', podrazumevano: true },
    ],
  },

  // ------------------------------------------------------------- OGLASI
  oglasi: {
    tabela: 'oglasi',
    naslov: 'Mali oglasi',
    novo: 'Novi oglas',
    opis: 'Oglasi koje šalju građani čekaju tvoje odobrenje. Odobreni traju 30 dana.',
    red: ['created_at', false],
    pretraga: 'naslov',
    filter: { polje: 'status', opcije: STATUS_MODERACIJE, podrazumevano: 'na_cekanju' },
    moderacija: true,
    javniLink: (r) => (r.status === 'odobren' ? `/oglasi/${r.id}` : null),
    kolone: [
      { polje: 'slika_url', tip: 'slika' },
      { polje: 'naslov', naslov: 'Oglas', glavna: true },
      { polje: 'kategorija', naslov: 'Kategorija' },
      { polje: 'telefon', naslov: 'Kontakt', prikaz: (r) => [r.ime, r.telefon, r.email].filter(Boolean).join(' · ') },
      { polje: 'status', naslov: 'Status', tip: 'status', opcije: STATUS_MODERACIJE },
      { polje: 'created_at', naslov: 'Poslat', tip: 'datumVreme' },
    ],
    polja: [
      { ime: 'naslov', naslov: 'Naslov', tip: 'text', obavezno: true },
      { ime: 'kategorija', naslov: 'Kategorija', tip: 'select', opcije: kaoOpcije(KATEGORIJE_OGLASA), obavezno: true, pola: true },
      { ime: 'cena', naslov: 'Cena', tip: 'text', pola: true },
      { ime: 'opis', naslov: 'Opis', tip: 'textarea', redova: 6 },
      { ime: 'slika_url', naslov: 'Slika', tip: 'slika', folder: 'oglasi' },
      { ime: 'mesto', naslov: 'Mesto', tip: 'text', pola: true },
      { ime: 'ime', naslov: 'Ime', tip: 'text', pola: true },
      { ime: 'telefon', naslov: 'Telefon', tip: 'tel', pola: true },
      { ime: 'email', naslov: 'Email', tip: 'email', pola: true },
      { ime: 'status', naslov: 'Status', tip: 'select', opcije: STATUS_MODERACIJE, podrazumevano: 'odobren', pola: true },
      { ime: 'istice', naslov: 'Ističe', tip: 'date', pola: true, pomoc: 'Prazno = za 30 dana.' },
    ],
  },

  // ------------------------------------------------------------- KOMENTARI
  komentari: {
    tabela: 'komentari',
    naslov: 'Komentari',
    bezNovog: true,
    opis: 'Komentari se pojavljuju ispod vesti tek kad ih odobriš.',
    red: ['created_at', false],
    pretraga: 'tekst',
    filter: { polje: 'status', opcije: STATUS_MODERACIJE, podrazumevano: 'na_cekanju' },
    moderacija: true,
    select: '*, vest:vesti(naslov,slug)',
    kolone: [
      { polje: 'tekst', naslov: 'Komentar', glavna: true, prikaz: (r) => (r.tekst?.length > 140 ? `${r.tekst.slice(0, 140)}…` : r.tekst) },
      { polje: 'ime', naslov: 'Autor' },
      { polje: 'vest', naslov: 'Vest', prikaz: (r) => r.vest?.naslov ?? '—' },
      { polje: 'status', naslov: 'Status', tip: 'status', opcije: STATUS_MODERACIJE },
      { polje: 'created_at', naslov: 'Vreme', tip: 'datumVreme' },
    ],
    polja: [
      { ime: 'ime', naslov: 'Ime', tip: 'text', obavezno: true },
      { ime: 'tekst', naslov: 'Komentar', tip: 'textarea', redova: 6, obavezno: true },
      { ime: 'status', naslov: 'Status', tip: 'select', opcije: STATUS_MODERACIJE },
    ],
  },

  // ------------------------------------------------------------- SERVIS
  servis: {
    tabela: 'servis',
    naslov: 'Servisne informacije',
    novo: 'Novo obaveštenje',
    opis: 'Isključenja struje i vode, stanje na putevima, red vožnje i čitulje.',
    red: ['datum', false],
    pretraga: 'naslov',
    filter: { polje: 'tip', opcije: SERVIS_TIPOVI },
    javniLink: (r) => `/servis#${r.tip}`,
    kolone: [
      { polje: 'naslov', naslov: 'Naslov', glavna: true },
      { polje: 'tip', naslov: 'Vrsta', tip: 'opcija', opcije: SERVIS_TIPOVI },
      { polje: 'datum', naslov: 'Datum', tip: 'dan' },
      { polje: 'aktivno', naslov: 'Na sajtu', tip: 'bool' },
    ],
    polja: [
      { ime: 'tip', naslov: 'Vrsta', tip: 'select', opcije: SERVIS_TIPOVI, obavezno: true, pola: true },
      { ime: 'datum', naslov: 'Datum', tip: 'date', pola: true },
      { ime: 'naslov', naslov: 'Naslov', tip: 'text', obavezno: true, pomoc: 'npr. „Bez struje u subotu od 9 do 13 h" ili ime i prezime preminulog' },
      { ime: 'tekst', naslov: 'Tekst', tip: 'textarea', redova: 8, pomoc: 'Za red vožnje: svaki polazak u novi red.' },
      { ime: 'slika_url', naslov: 'Slika (za čitulju)', tip: 'slika', folder: 'servis' },
      { ime: 'aktivno', naslov: 'Prikaži na sajtu', tip: 'checkbox', podrazumevano: true },
    ],
  },
};

// Polja na stranici Podešavanja (tabela „podesavanja")
export const PODESAVANJA = [
  { ime: 'ticker', naslov: 'Traka „Najnovije" ispod menija', tip: 'textarea', redova: 4, pomoc: 'Svaka vest u novi red. Prazno = automatski poslednje 3 vesti.' },
  { ime: 'o_nama', naslov: 'Tekst o portalu (u futeru)', tip: 'textarea', redova: 3 },
  { ime: 'oglasavanje', naslov: 'Tekst na stranici „Oglašavanje"', tip: 'textarea', redova: 5 },
  { ime: 'facebook_url', naslov: 'Facebook stranica', tip: 'url' },
  { ime: 'kontakt_email', naslov: 'Kontakt email', tip: 'email' },
  { ime: 'kontakt_telefon', naslov: 'Kontakt telefon', tip: 'tel' },
];

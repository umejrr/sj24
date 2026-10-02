// Probni podaci za razvoj. U sledećoj fazi ovo zamenjuje Supabase baza,
// a funkcije na dnu ostaju iste, pa stranice ne moraju da se menjaju.

export const rubrike = [
  { slug: 'sjenica', naziv: 'Sjenica' },
  { slug: 'pester', naziv: 'Pešter' },
  { slug: 'sport', naziv: 'Sport' },
  { slug: 'kultura', naziv: 'Kultura' },
  { slug: 'hronika', naziv: 'Hronika' },
  { slug: 'dijaspora', naziv: 'Dijaspora' },
  { slug: 'poljoprivreda', naziv: 'Poljoprivreda' },
];

const demoTekst = [
  '[Ovo je probni tekst vesti. Ovde ide prvi pasus sa najvažnijim informacijama: šta se desilo, gde i kada.]',
  '[Drugi pasus daje više detalja, izjave sagovornika i kontekst koji čitaocu pomaže da razume temu.]',
  '[Treći pasus zaokružuje priču i navodi šta se dalje očekuje.]',
];

export const vesti = [
  { slug: 'zimska-sluzba-spremna-za-prve-snegove', rubrika: 'pester', naslov: 'Zimska služba spremna za prve snegove na Pešteru', uvod: '[Kratak uvod u vest u jednoj ili dve rečenice, da čitalac odmah zna o čemu se radi.]', datum: '2026-10-02T13:40:00+02:00', istaknuto: true, aktuelno: 'zimska-sluzba' },
  { slug: 'pocinje-rekonstrukcija-ulice-u-centru', rubrika: 'sjenica', naslov: 'Počinje rekonstrukcija ulice u centru grada', uvod: '[Uvod o radovima i izmeni saobraćaja.]', datum: '2026-10-02T12:10:00+02:00', istaknuto: true },
  { slug: 'otkup-mleka-sta-se-menja', rubrika: 'poljoprivreda', naslov: 'Otkup mleka: šta se menja od novembra', uvod: '[Uvod o novim uslovima otkupa.]', datum: '2026-10-02T10:30:00+02:00', istaknuto: true },
  { slug: 'sjenicani-u-inostranstvu-pomazu-skolu', rubrika: 'dijaspora', naslov: 'Sjeničani u inostranstvu pomažu školu', uvod: '[Uvod o akciji dijaspore.]', datum: '2026-10-02T09:00:00+02:00', istaknuto: true },
  { slug: 'stocari-se-pripremaju-za-zimu', rubrika: 'pester', naslov: 'Stočari se pripremaju za rani dolazak zime', uvod: '[Uvod o pripremama na Pešteru.]', datum: '2026-10-02T08:15:00+02:00' },
  { slug: 'domaci-tim-slavio-pred-punim-tribinama', rubrika: 'sport', naslov: 'Domaći tim slavio pred punim tribinama', uvod: '[Uvod o utakmici.]', datum: '2026-10-01T20:30:00+02:00' },
  { slug: 'otvaranje-izlozbe-u-domu-kulture', rubrika: 'kultura', naslov: 'Večeras otvaranje izložbe u domu kulture', uvod: '[Uvod o izložbi.]', datum: '2026-10-01T16:00:00+02:00' },
  { slug: 'saobracaj-otezan-ka-novom-pazaru', rubrika: 'hronika', naslov: 'Saobraćaj otežan na putu ka Novom Pazaru', uvod: '[Uvod o stanju na putu.]', datum: '2026-10-01T11:45:00+02:00' },
  { slug: 'nova-vodovodna-mreza', rubrika: 'sjenica', naslov: 'Nova vodovodna mreža: koje ulice su na redu', uvod: '[Uvod o radovima na vodovodu.]', datum: '2026-09-30T14:00:00+02:00', aktuelno: 'vodovod' },
  { slug: 'stari-zanati-pestera', rubrika: 'kultura', naslov: 'Stari zanati Peštera: ko ih još čuva', uvod: '[Uvod o tradicionalnim zanatima.]', datum: '2026-09-29T10:00:00+02:00', preporuceno: true },
  { slug: 'subvencije-za-poljoprivrednike', rubrika: 'poljoprivreda', naslov: 'Kako do subvencija za poljoprivrednike ove godine', uvod: '[Uvod o rokovima i uslovima.]', datum: '2026-09-28T09:30:00+02:00' },
  { slug: 'sjenicki-sir-na-sajmu', rubrika: 'pester', naslov: 'Sjenički sir na sajmu u Beogradu', uvod: '[Uvod o sajmu.]', datum: '2026-09-27T12:00:00+02:00', aktuelno: 'sajam-sira' },
].map((v) => ({ ...v, tekst: demoTekst }));

export const aktuelneTeme = [
  { slug: 'zimska-sluzba', naslov: 'Zimska služba 2026/27' },
  { slug: 'vodovod', naslov: 'Nova vodovodna mreža' },
  { slug: 'stipendije', naslov: 'Upis i stipendije za studente' },
  { slug: 'sajam-sira', naslov: 'Sajam sjeničkog sira' },
];

export const najcitanije = [
  'pocinje-rekonstrukcija-ulice-u-centru',
  'subvencije-za-poljoprivrednike',
  'sjenicki-sir-na-sajmu',
  'zimska-sluzba-spremna-za-prve-snegove',
  'otvaranje-izlozbe-u-domu-kulture',
];

export const oglasi = [
  { id: 1, kategorija: 'Vozila', naslov: 'Putnički automobil, 2016, dizel', cena: '[CENA] €', datum: '2026-10-01' },
  { id: 2, kategorija: 'Nekretnine', naslov: 'Plac 10 ari, okolina Sjenice', cena: '[CENA] €', datum: '2026-09-30' },
  { id: 3, kategorija: 'Poljoprivreda', naslov: 'Prodajem junad, 6 grla', cena: 'Po dogovoru', datum: '2026-09-30' },
  { id: 4, kategorija: 'Posao', naslov: 'Tražim vozača C kategorije', cena: '[PLATA]', datum: '2026-09-29' },
];

export const firme = [
  { slug: 'firma', naziv: '[Naziv firme]', kategorija: 'Ugostiteljstvo', paket: 'premium' },
  { slug: 'prevoz', naziv: '[Naziv firme]', kategorija: 'Prevoz', paket: 'standard' },
  { slug: 'gradnja', naziv: '[Naziv firme]', kategorija: 'Gradnja', paket: 'osnovni' },
];

export const kategorijeFirmi = ['Ugostiteljstvo', 'Prevoz', 'Gradnja', 'Zdravlje', 'Usluge'];

export const tickerVesti = [
  'Najava isključenja struje za subotu, 9–13 h',
  'Putevi preko Peštera prohodni',
  'Počinje upis na kurs stranih jezika',
];

// ---- Funkcije koje stranice koriste ----

const poDatumu = (a, b) => new Date(b.datum) - new Date(a.datum);

export function nazivRubrike(slug) {
  return rubrike.find((r) => r.slug === slug)?.naziv ?? slug;
}

export function sveVesti() {
  return [...vesti].sort(poDatumu);
}

export function istaknuteVesti() {
  return sveVesti().filter((v) => v.istaknuto).slice(0, 4);
}

export function najnovijeVesti(limit = 5, preskoci = []) {
  return sveVesti().filter((v) => !preskoci.includes(v.slug)).slice(0, limit);
}

export function vestPoSlugu(slug) {
  return vesti.find((v) => v.slug === slug) ?? null;
}

export function vestiRubrike(slug) {
  return sveVesti().filter((v) => v.rubrika === slug);
}

export function najcitanijeVesti() {
  return najcitanije.map(vestPoSlugu).filter(Boolean);
}

export function preporucenaVest() {
  return vesti.find((v) => v.preporuceno) ?? vesti[0];
}

export function povezaneVesti(vest, limit = 3) {
  return sveVesti().filter((v) => v.rubrika === vest.rubrika && v.slug !== vest.slug).slice(0, limit);
}

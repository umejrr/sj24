// Probni podaci: prikazuju se SAMO dok Supabase baza nije povezana
// (da sajt na Vercelu ne bude prazan). Posle povezivanja sve dolazi iz CMS-a.

export const rubrike = [
  { slug: 'sjenica', naziv: 'Sjenica', redosled: 1 },
  { slug: 'pester', naziv: 'Pešter', redosled: 2 },
  { slug: 'sport', naziv: 'Sport', redosled: 3 },
  { slug: 'kultura', naziv: 'Kultura', redosled: 4 },
  { slug: 'hronika', naziv: 'Hronika', redosled: 5 },
  { slug: 'dijaspora', naziv: 'Dijaspora', redosled: 6 },
  { slug: 'poljoprivreda', naziv: 'Poljoprivreda', redosled: 7 },
];

const tekst = '[Ovo je probni tekst vesti. Ovde ide prvi pasus sa najvažnijim informacijama: šta se desilo, gde i kada.]\n\n[Drugi pasus daje više detalja, izjave sagovornika i kontekst koji čitaocu pomaže da razume temu.]\n\n[Treći pasus zaokružuje priču i navodi šta se dalje očekuje.]';

export const vesti = [
  { slug: 'zimska-sluzba-spremna-za-prve-snegove', rubrika: 'pester', naslov: 'Zimska služba spremna za prve snegove na Pešteru', uvod: '[Kratak uvod u vest u jednoj ili dve rečenice, da čitalac odmah zna o čemu se radi.]', datum: '2026-10-02T13:40:00+02:00', istaknuto: true, tema: 'zimska-sluzba', pregledi: 120 },
  { slug: 'pocinje-rekonstrukcija-ulice-u-centru', rubrika: 'sjenica', naslov: 'Počinje rekonstrukcija ulice u centru grada', uvod: '[Uvod o radovima i izmeni saobraćaja.]', datum: '2026-10-02T12:10:00+02:00', istaknuto: true, pregledi: 340 },
  { slug: 'otkup-mleka-sta-se-menja', rubrika: 'poljoprivreda', naslov: 'Otkup mleka: šta se menja od novembra', uvod: '[Uvod o novim uslovima otkupa.]', datum: '2026-10-02T10:30:00+02:00', istaknuto: true, pregledi: 90 },
  { slug: 'sjenicani-u-inostranstvu-pomazu-skolu', rubrika: 'dijaspora', naslov: 'Sjeničani u inostranstvu pomažu školu', uvod: '[Uvod o akciji dijaspore.]', datum: '2026-10-02T09:00:00+02:00', istaknuto: true, pregledi: 60 },
  { slug: 'stocari-se-pripremaju-za-zimu', rubrika: 'pester', naslov: 'Stočari se pripremaju za rani dolazak zime', uvod: '[Uvod o pripremama na Pešteru.]', datum: '2026-10-02T08:15:00+02:00', pregledi: 40 },
  { slug: 'domaci-tim-slavio-pred-punim-tribinama', rubrika: 'sport', naslov: 'Domaći tim slavio pred punim tribinama', uvod: '[Uvod o utakmici.]', datum: '2026-10-01T20:30:00+02:00', pregledi: 75 },
  { slug: 'otvaranje-izlozbe-u-domu-kulture', rubrika: 'kultura', naslov: 'Večeras otvaranje izložbe u domu kulture', uvod: '[Uvod o izložbi.]', datum: '2026-10-01T16:00:00+02:00', pregledi: 150 },
  { slug: 'saobracaj-otezan-ka-novom-pazaru', rubrika: 'hronika', naslov: 'Saobraćaj otežan na putu ka Novom Pazaru', uvod: '[Uvod o stanju na putu.]', datum: '2026-10-01T11:45:00+02:00', pregledi: 30 },
  { slug: 'nova-vodovodna-mreza', rubrika: 'sjenica', naslov: 'Nova vodovodna mreža: koje ulice su na redu', uvod: '[Uvod o radovima na vodovodu.]', datum: '2026-09-30T14:00:00+02:00', tema: 'vodovod', pregledi: 200 },
  { slug: 'stari-zanati-pestera', rubrika: 'kultura', naslov: 'Stari zanati Peštera: ko ih još čuva', uvod: '[Uvod o tradicionalnim zanatima.]', datum: '2026-09-29T10:00:00+02:00', preporuceno: true, pregledi: 20 },
  { slug: 'subvencije-za-poljoprivrednike', rubrika: 'poljoprivreda', naslov: 'Kako do subvencija za poljoprivrednike ove godine', uvod: '[Uvod o rokovima i uslovima.]', datum: '2026-09-28T09:30:00+02:00', pregledi: 260 },
  { slug: 'sjenicki-sir-na-sajmu', rubrika: 'pester', naslov: 'Sjenički sir na sajmu u Beogradu', uvod: '[Uvod o sajmu.]', datum: '2026-09-27T12:00:00+02:00', tema: 'sajam-sira', pregledi: 180 },
].map((v, i) => ({
  id: `demo-${i}`, tekst, slika_url: null, autor: 'Redakcija SJ24', status: 'objavljeno',
  istaknuto: false, preporuceno: false, tema: null, ...v,
}));

export const teme = [
  { slug: 'zimska-sluzba', naslov: 'Zimska služba 2026/27', opis: null },
  { slug: 'vodovod', naslov: 'Nova vodovodna mreža', opis: null },
  { slug: 'stipendije', naslov: 'Upis i stipendije za studente', opis: null },
  { slug: 'sajam-sira', naslov: 'Sajam sjeničkog sira', opis: null },
];

export const oglasi = [
  { id: 'demo-1', kategorija: 'Vozila', naslov: 'Putnički automobil, 2016, dizel', cena: '[CENA] €', mesto: 'Sjenica', created_at: '2026-10-01T10:00:00Z' },
  { id: 'demo-2', kategorija: 'Nekretnine', naslov: 'Plac 10 ari, okolina Sjenice', cena: '[CENA] €', mesto: 'Sjenica', created_at: '2026-09-30T10:00:00Z' },
  { id: 'demo-3', kategorija: 'Poljoprivreda i stoka', naslov: 'Prodajem junad, 6 grla', cena: 'Po dogovoru', mesto: 'Pešter', created_at: '2026-09-30T09:00:00Z' },
  { id: 'demo-4', kategorija: 'Posao', naslov: 'Tražim vozača C kategorije', cena: '[PLATA]', mesto: 'Sjenica', created_at: '2026-09-29T10:00:00Z' },
].map((o) => ({ opis: '[Opis oglasa]', ime: '[Ime]', telefon: '[Telefon]', email: null, slika_url: null, istice: '2026-12-31', ...o }));

export const firme = [
  { slug: 'firma', naziv: '[Naziv firme]', kategorija: 'Ugostiteljstvo', paket: 'premium' },
  { slug: 'prevoz', naziv: '[Naziv firme]', kategorija: 'Prevoz', paket: 'standard' },
  { slug: 'gradnja', naziv: '[Naziv firme]', kategorija: 'Gradnja', paket: 'osnovni' },
].map((f, i) => ({
  id: `demo-${i}`, kratak_opis: '[Kratak opis firme]', opis: '[Opis firme, usluge, ponuda.]',
  logo_url: null, naslovna_url: null, galerija: [], telefon: '[Telefon]', email: null, web: null,
  adresa: 'Sjenica', radno_vreme: 'Pon–Pet 8–16\nSub 8–13', ...f,
}));

export const podesavanja = {
  ticker: 'Najava isključenja struje za subotu, 9–13 h\nPutevi preko Peštera prohodni\nPočinje upis na kurs stranih jezika',
  facebook_url: '',
  kontakt_email: '',
  kontakt_telefon: '',
  o_nama: 'Lokalni portal Sjenice i Peštera. Vesti, oglasi i firme na jednom mestu.',
  oglasavanje: 'Vaša firma može imati svoju stranicu na adresi vasafirma.sj24.com i reklamu na portalu. Javite nam se za ponudu.',
};

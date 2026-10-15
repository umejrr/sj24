// Liste koje koriste i sajt i CMS. Menjaju se ovde, na jednom mestu.

export const KATEGORIJE_FIRMI = [
  'Ugostiteljstvo', 'Prodavnice', 'Prevoz', 'Gradnja', 'Zdravlje',
  'Lepota i nega', 'Usluge', 'Poljoprivreda', 'Turizam', 'Ostalo',
];

export const KATEGORIJE_OGLASA = [
  'Nekretnine', 'Vozila', 'Poljoprivreda i stoka', 'Posao', 'Usluge', 'Prodaja raznog',
];

export const PAKETI = [
  ['osnovni', 'Osnovni'],
  ['standard', 'Standard'],
  ['premium', 'Premium'],
];

export const POZICIJE_REKLAMA = [
  ['leaderboard', 'Udarni baner u zaglavlju (728 × 90)'],
  ['sidebar_1', 'Desna kolona 1 (300 × 250)'],
  ['sidebar_2', 'Desna kolona 2 (300 × 250)'],
  ['sidebar_3', 'Desna kolona 3, visoki (300 × 600)'],
  ['ispod_vesti', 'Ispod svake vesti (300 × 250)'],
  ['native', 'Sponzorisana kartica među vestima'],
];

export const SERVIS_TIPOVI = [
  ['struja_voda', 'Struja i voda'],
  ['putevi', 'Stanje na putevima'],
  ['red_voznje', 'Red vožnje'],
  ['citulje', 'Čitulje'],
];

export const STATUS_MODERACIJE = [
  ['na_cekanju', 'Na čekanju'],
  ['odobren', 'Odobren'],
  ['odbijen', 'Odbijen'],
];

export const STATUS_VESTI = [
  ['nacrt', 'Nacrt'],
  ['objavljeno', 'Objavljeno'],
];

export function labela(lista, vrednost) {
  return lista.find(([v]) => v === vrednost)?.[1] ?? vrednost ?? '';
}

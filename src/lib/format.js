const meseci = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
const dani = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];

// Vreme se uvek računa za Srbiju, bez obzira gde server radi.
function uSrbiji(datum) {
  const d = new Date(datum);
  const delovi = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Belgrade',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
  }).formatToParts(d);
  const p = Object.fromEntries(delovi.map((x) => [x.type, x.value]));
  const daniEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    dan: Number(p.day),
    mesec: Number(p.month) - 1,
    godina: Number(p.year),
    sat: p.hour === '24' ? '00' : p.hour,
    minut: p.minute,
    danUNedelji: daniEn.indexOf(p.weekday),
  };
}

export function formatDatum(datum) {
  const t = uSrbiji(datum);
  return `${t.dan}. ${meseci[t.mesec]} ${t.godina}, ${t.sat}:${t.minut}`;
}

export function formatKratko(datum) {
  const t = uSrbiji(datum);
  return `${t.dan}. ${meseci[t.mesec].slice(0, 3)}, ${t.sat}:${t.minut}`;
}

export function danasnjiDatum() {
  const t = uSrbiji(new Date());
  return `${dani[t.danUNedelji]}, ${t.dan}. ${meseci[t.mesec]} ${t.godina}`;
}

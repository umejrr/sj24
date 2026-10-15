const meseci = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
const dani = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
const ZONA = 'Europe/Belgrade';

// Vreme se uvek računa za Srbiju, bez obzira gde server radi.
function uSrbiji(datum) {
  const d = new Date(datum);
  const delovi = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA,
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

const dva = (n) => String(n).padStart(2, '0');

export function formatDatum(datum) {
  if (!datum) return '';
  const t = uSrbiji(datum);
  return `${t.dan}. ${meseci[t.mesec]} ${t.godina}, ${t.sat}:${t.minut}`;
}

export function formatKratko(datum) {
  if (!datum) return '';
  const t = uSrbiji(datum);
  return `${t.dan}. ${meseci[t.mesec].slice(0, 3)}, ${t.sat}:${t.minut}`;
}

// „2026-10-15" → „15. 10. 2026."
export function formatDan(datum) {
  if (!datum) return '';
  const [g, m, d] = String(datum).slice(0, 10).split('-');
  return `${Number(d)}. ${Number(m)}. ${g}.`;
}

export function danasnjiDatum() {
  const t = uSrbiji(new Date());
  return `${dani[t.danUNedelji]}, ${t.dan}. ${meseci[t.mesec]} ${t.godina}`;
}

// Današnji datum u Srbiji kao „YYYY-MM-DD"
export function danasISO() {
  const t = uSrbiji(new Date());
  return `${t.godina}-${dva(t.mesec + 1)}-${dva(t.dan)}`;
}

export function dodajDane(isoDan, broj) {
  const d = new Date(`${isoDan}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + broj);
  return d.toISOString().slice(0, 10);
}

// ---- Polje „datum i vreme" u CMS-u (uvek po srpskom vremenu) ----

// ISO iz baze → „YYYY-MM-DDTHH:mm" za <input type="datetime-local">
export function isoULokalno(iso) {
  if (!iso) return '';
  const t = uSrbiji(iso);
  return `${t.godina}-${dva(t.mesec + 1)}-${dva(t.dan)}T${t.sat}:${t.minut}`;
}

// „YYYY-MM-DDTHH:mm" (srpsko vreme) → ISO za bazu
export function lokalnoUIso(lokalno) {
  if (!lokalno) return null;
  const kaoUtc = new Date(`${lokalno}:00Z`);
  if (Number.isNaN(kaoUtc.getTime())) return null;
  const t = uSrbiji(kaoUtc);
  const prikazano = Date.UTC(t.godina, t.mesec, t.dan, Number(t.sat), Number(t.minut));
  const pomak = prikazano - kaoUtc.getTime(); // razlika Srbija − UTC
  return new Date(kaoUtc.getTime() - pomak).toISOString();
}

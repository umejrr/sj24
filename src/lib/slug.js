// Pravi adresu (slug) od naslova: „Zimska služba na Pešteru" → „zimska-sluzba-na-pesteru"
const mapa = { č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'dj', dž: 'dz' };

export function napraviSlug(tekst = '') {
  return String(tekst)
    .toLowerCase()
    .replace(/dž/g, 'dz')
    .replace(/[čćšžđ]/g, (z) => mapa[z])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

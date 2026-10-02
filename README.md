# SJ24

Lokalni portal Sjenice i Peštera: vesti, mali oglasi, imenik firmi i stranice firmi (firma.sj24.com).

## Tehnologija

- **Next.js** (App Router), bez dodatnih biblioteka
- **Supabase** (baza, prijava preko Google/Facebook naloga, slike) — dolazi u sledećoj fazi
- Razvoj i testiranje na **Vercel** besplatnom planu; pre puštanja uživo sa reklamama prelazak na plan koji dozvoljava komercijalnu upotrebu

## Pokretanje na računaru

```bash
npm install
npm run dev
```

Zatim otvori http://localhost:3000

## Struktura

```
src/
  app/              stranice (naslovna, vesti, rubrike)
  components/       delovi dizajna (zaglavlje, karusel, reklame…)
  lib/data.js       probni podaci, kasnije zamena za Supabase
```

## Plan

1. Naslovna, stranica vesti, rubrike (probni podaci) ← sada
2. Supabase baza + administracija za vesti
3. Stranice firmi na poddomenima + imenik firmi + paketi
4. Mali oglasi (unos, odobravanje, ističu za 30 dana)
5. Prijava (Google/Facebook), komentari uz odobravanje
6. Statistika reklama, automatsko objavljivanje na Facebook

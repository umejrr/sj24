# SJ24

Lokalni portal Sjenice i Peštera: vesti, aktuelno, mali oglasi, imenik firmi, stranice firmi (firma.sj24.com), reklame i servisne informacije, sa CMS-om za unos svega.

- **Sajt:** `/`
- **CMS (administracija):** `/admin`

## Tehnologija

- **Next.js** (App Router)
- **Supabase**: baza, prijava u CMS i slike
- **Vercel**: besplatni plan za razvoj i testiranje. Pre puštanja uživo sa reklamama sajt treba prebaciti na plan koji dozvoljava komercijalnu upotrebu.

Dok Supabase nije povezan, sajt prikazuje probne podatke, a `/admin` prikazuje uputstvo za povezivanje.

## Povezivanje baze (jednom, oko 10 minuta)

1. **Supabase projekat:** na [supabase.com](https://supabase.com) napravi projekat `sj24`, region **Frankfurt (eu-central-1)**.
2. **Tabele:** otvori **SQL Editor → New query** i nalepi ceo fajl [`supabase/schema.sql`](supabase/schema.sql).
   - U **poslednjem redu** zameni `TVOJ@EMAIL.COM` svojim emailom.
   - Klikni **Run**.
3. **Nalog za CMS:** u **Authentication → Users → Add user → Create new user** upiši isti email i lozinku i uključi „Auto Confirm User".
4. **Ključevi:** u **Project Settings → API** (ili dugme **Connect**) kopiraj **Project URL** i **anon / publishable** ključ.
5. **Vercel:** u **Settings → Environment Variables** dodaj:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/publishable ključ

   Zatim u **Deployments** pokreni **Redeploy**.
6. Otvori `https://<tvoj-sajt>.vercel.app/admin` i prijavi se.

> Ključ `service_role` / `secret` **nikad** ne upisuj u Vercel ni u kod. Ovom sajtu nije potreban.

## CMS: sekcije

| Grupa | Sekcija | Šta radi |
|---|---|---|
| | **Pregled** | Brojke, šta čeka odobrenje, pretplate firmi koje ističu, najčitanije vesti, klikovi na reklame |
| Sadržaj | **Vesti** | Pisanje vesti, fotografija, rubrika, tema, nacrt/objavljeno, zakazivanje, karusel, „Preporučeno" |
| | **Aktuelno** | Teme o kojima se priča danima (vesti se vezuju za temu) |
| | **Rubrike** | Stavke menija (Sjenica, Pešter, Sport…) |
| Zarada | **Firme i sponzori** | Stranica firme, paket, „Plaćeno do" (sama se sakriva po isteku), dugme **+30 dana** kad firma plati |
| | **Reklame** | Baneri po mestima na sajtu, rok važenja, broj prikaza, klikova i CTR |
| Zajednica | **Mali oglasi** | Oglasi građana čekaju odobrenje i ističu za 30 dana |
| | **Komentari** | Odobravanje komentara |
| Servis | **Servisne informacije** | Struja i voda, putevi, red vožnje, čitulje |
| Sajt | **Podešavanja** | Traka „Najnovije", tekst o portalu, tekst za oglašavanje, Facebook, kontakt |

Polja svake sekcije su opisana na jednom mestu, u `src/lib/cms.js`. Novo polje se dodaje tako što dodaš kolonu u bazu i jedan red tamo.

## Mesta za reklame

| Mesto | Dimenzije |
|---|---|
| Udarni baner u zaglavlju | 728 × 90 |
| Desna kolona 1 i 2 | 300 × 250 |
| Desna kolona 3 (visoki) | 300 × 600 |
| Ispod svake vesti | 300 × 250 |
| Sponzorisana kartica među vestima | fotografija + tekst |

Ako na istom mestu ima više aktivnih reklama, smenjuju se nasumično.

## Pokretanje na računaru

```bash
npm install
cp .env.example .env.local   # pa upiši ključeve
npm run dev
```

## Sledeće faze

- Prijava čitalaca preko Google/Facebook naloga i pisanje komentara
- Automatsko objavljivanje vesti na Facebook stranicu
- Pretraga
- Poddomeni `firma.sj24.com` na pravom domenu (kod je spreman, potreban je wildcard domen `*.sj24.com`)

Vremensku prognozu daje [Open-Meteo](https://open-meteo.com). Njihov besplatni plan je za nekomercijalnu upotrebu, pa pre puštanja sa reklamama proveri njihove uslove.

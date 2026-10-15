-- =====================================================================
-- SJ24 — šema baze za Supabase
-- Pokreni CEO fajl jednom: Supabase → SQL Editor → New query → Run.
-- Bezbedno je pokrenuti ga ponovo (ne briše postojeće podatke).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Administratori: ko sme da uređuje sajt (po email adresi naloga)
-- ---------------------------------------------------------------------
create table if not exists public.admini (
  email text primary key
);

create or replace function public.je_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admini
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------
-- Sadržaj
-- ---------------------------------------------------------------------
create table if not exists public.rubrike (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  naziv text not null,
  redosled int not null default 0
);

create table if not exists public.teme (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  naslov text not null,
  opis text,
  aktivna boolean not null default true,
  redosled int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.vesti (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  naslov text not null,
  uvod text,
  tekst text,
  rubrika text references public.rubrike(slug) on update cascade on delete set null,
  tema text references public.teme(slug) on update cascade on delete set null,
  slika_url text,
  slika_opis text,
  autor text default 'Redakcija SJ24',
  status text not null default 'nacrt' check (status in ('nacrt', 'objavljeno')),
  istaknuto boolean not null default false,
  preporuceno boolean not null default false,
  datum timestamptz not null default now(),
  pregledi int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists vesti_status_datum on public.vesti (status, datum desc);
create index if not exists vesti_rubrika on public.vesti (rubrika, datum desc);

-- ---------------------------------------------------------------------
-- Zarada: firme (stranice firma.sj24.com) i reklame
-- ---------------------------------------------------------------------
create table if not exists public.firme (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  naziv text not null,
  kategorija text,
  kratak_opis text,
  opis text,
  logo_url text,
  naslovna_url text,
  galerija text[] not null default '{}',
  telefon text,
  email text,
  web text,
  adresa text,
  radno_vreme text,
  paket text not null default 'osnovni' check (paket in ('osnovni', 'standard', 'premium')),
  placeno_do date,
  aktivna boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reklame (
  id uuid primary key default gen_random_uuid(),
  naziv text not null,
  firma_id uuid references public.firme(id) on delete set null,
  pozicija text not null check (pozicija in ('leaderboard', 'sidebar_1', 'sidebar_2', 'sidebar_3', 'ispod_vesti', 'native')),
  slika_url text,
  video_url text,
  naslov text,
  link_url text,
  aktivna boolean not null default true,
  vazi_od date,
  vazi_do date,
  prikazi int not null default 0,
  klikovi int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Zajednica: mali oglasi i komentari
-- ---------------------------------------------------------------------
create table if not exists public.oglasi (
  id uuid primary key default gen_random_uuid(),
  kategorija text not null,
  naslov text not null,
  opis text,
  cena text,
  mesto text,
  ime text,
  telefon text,
  email text,
  slika_url text,
  status text not null default 'na_cekanju' check (status in ('na_cekanju', 'odobren', 'odbijen')),
  istice date not null default (current_date + 30),
  created_at timestamptz not null default now()
);

create table if not exists public.komentari (
  id uuid primary key default gen_random_uuid(),
  vest_id uuid not null references public.vesti(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  ime text not null,
  tekst text not null,
  status text not null default 'na_cekanju' check (status in ('na_cekanju', 'odobren', 'odbijen')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Servis i podešavanja
-- ---------------------------------------------------------------------
create table if not exists public.servis (
  id uuid primary key default gen_random_uuid(),
  tip text not null check (tip in ('struja_voda', 'putevi', 'red_voznje', 'citulje')),
  naslov text not null,
  tekst text,
  slika_url text,
  datum date not null default current_date,
  aktivno boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.podesavanja (
  kljuc text primary key,
  vrednost text
);

-- ---------------------------------------------------------------------
-- Pravila pristupa (RLS): svi vide objavljeno, samo admin menja
-- ---------------------------------------------------------------------
alter table public.admini enable row level security;
alter table public.rubrike enable row level security;
alter table public.teme enable row level security;
alter table public.vesti enable row level security;
alter table public.firme enable row level security;
alter table public.reklame enable row level security;
alter table public.oglasi enable row level security;
alter table public.komentari enable row level security;
alter table public.servis enable row level security;
alter table public.podesavanja enable row level security;

do $$
declare t text;
begin
  -- obriši stare verzije pravila da bi skripta mogla ponovo da se pokrene
  for t in select unnest(array['admini','rubrike','teme','vesti','firme','reklame','oglasi','komentari','servis','podesavanja']) loop
    execute format('drop policy if exists "admin sve" on public.%I', t);
    execute format('drop policy if exists "javno citanje" on public.%I', t);
    execute format('create policy "admin sve" on public.%I for all using (public.je_admin()) with check (public.je_admin())', t);
  end loop;
end $$;

create policy "javno citanje" on public.rubrike for select using (true);
create policy "javno citanje" on public.teme for select using (aktivna);
create policy "javno citanje" on public.vesti for select using (status = 'objavljeno' and datum <= now());
create policy "javno citanje" on public.firme for select
  using (aktivna and (placeno_do is null or placeno_do >= current_date));
create policy "javno citanje" on public.reklame for select
  using (aktivna and (vazi_od is null or vazi_od <= current_date) and (vazi_do is null or vazi_do >= current_date));
create policy "javno citanje" on public.oglasi for select using (status = 'odobren' and istice >= current_date);
create policy "javno citanje" on public.komentari for select using (status = 'odobren');
create policy "javno citanje" on public.servis for select using (aktivno);
create policy "javno citanje" on public.podesavanja for select using (true);

-- Građani predaju oglas (ide na čekanje dok ga ne odobriš)
drop policy if exists "predaja oglasa" on public.oglasi;
create policy "predaja oglasa" on public.oglasi for insert to anon, authenticated
  with check (status = 'na_cekanju');

-- Prijavljeni korisnici pišu komentare (idu na čekanje)
drop policy if exists "pisanje komentara" on public.komentari;
create policy "pisanje komentara" on public.komentari for insert to authenticated
  with check (status = 'na_cekanju' and user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Brojači: pregledi vesti, prikazi i klikovi reklama
-- ---------------------------------------------------------------------
create or replace function public.zabelezi_pregled(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.vesti set pregledi = pregledi + 1 where slug = p_slug and status = 'objavljeno';
$$;

create or replace function public.zabelezi_prikaz(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.reklame set prikazi = prikazi + 1 where id = p_id;
$$;

create or replace function public.zabelezi_klik(p_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_link text;
begin
  update public.reklame set klikovi = klikovi + 1 where id = p_id;
  select coalesce(nullif(r.link_url, ''), case when f.slug is not null then '/firma/' || f.slug end)
    into v_link
    from public.reklame r left join public.firme f on f.id = r.firma_id
    where r.id = p_id;
  return v_link;
end;
$$;

grant execute on function public.je_admin() to anon, authenticated;
grant execute on function public.zabelezi_pregled(text) to anon, authenticated;
grant execute on function public.zabelezi_prikaz(uuid) to anon, authenticated;
grant execute on function public.zabelezi_klik(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Slike (Supabase Storage, folder „slike")
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('slike', 'slike', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "slike javno citanje" on storage.objects;
drop policy if exists "slike admin upis" on storage.objects;
drop policy if exists "slike admin izmena" on storage.objects;
drop policy if exists "slike admin brisanje" on storage.objects;
drop policy if exists "slike oglasi upis" on storage.objects;

create policy "slike javno citanje" on storage.objects for select using (bucket_id = 'slike');
create policy "slike admin upis" on storage.objects for insert to authenticated
  with check (bucket_id = 'slike' and public.je_admin());
create policy "slike admin izmena" on storage.objects for update
  using (bucket_id = 'slike' and public.je_admin());
create policy "slike admin brisanje" on storage.objects for delete
  using (bucket_id = 'slike' and public.je_admin());
create policy "slike oglasi upis" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'slike' and (storage.foldername(name))[1] = 'oglasi');

-- ---------------------------------------------------------------------
-- Početni podaci
-- ---------------------------------------------------------------------
insert into public.rubrike (slug, naziv, redosled) values
  ('sjenica', 'Sjenica', 1), ('pester', 'Pešter', 2), ('sport', 'Sport', 3),
  ('kultura', 'Kultura', 4), ('hronika', 'Hronika', 5), ('dijaspora', 'Dijaspora', 6),
  ('poljoprivreda', 'Poljoprivreda', 7)
on conflict (slug) do nothing;

insert into public.teme (slug, naslov, redosled) values
  ('zimska-sluzba', 'Zimska služba 2026/27', 1),
  ('vodovod', 'Nova vodovodna mreža', 2)
on conflict (slug) do nothing;

insert into public.podesavanja (kljuc, vrednost) values
  ('ticker', ''),
  ('facebook_url', ''),
  ('kontakt_email', ''),
  ('kontakt_telefon', ''),
  ('o_nama', 'Lokalni portal Sjenice i Peštera. Vesti, oglasi i firme na jednom mestu.'),
  ('oglasavanje', 'Vaša firma može imati svoju stranicu na adresi vasafirma.sj24.com i reklamu na portalu. Javite nam se za ponudu.')
on conflict (kljuc) do nothing;

-- ⬇⬇⬇  OBAVEZNO: upiši email sa kojim ćeš se prijavljivati u CMS  ⬇⬇⬇
insert into public.admini (email) values ('TVOJ@EMAIL.COM')
on conflict (email) do nothing;

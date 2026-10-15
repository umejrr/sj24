// Podaci za povezivanje sa Supabase bazom (iz Vercel podešavanja / .env.local).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

// Dok baza nije povezana, sajt prikazuje probne podatke, a CMS uputstvo za povezivanje.
export const imaSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

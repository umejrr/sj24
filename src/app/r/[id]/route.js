import { NextResponse } from 'next/server';
import { imaSupabase } from '@/lib/supabase/env';
import { javniKlijent } from '@/lib/supabase/public';

// Klik na reklamu: zabeleži klik pa preusmeri na sajt/stranicu firme.
export async function GET(request, { params }) {
  const { id } = await params;
  let cilj = '/';
  if (imaSupabase && /^[0-9a-f-]{36}$/i.test(id)) {
    const { data } = await javniKlijent().rpc('zabelezi_klik', { p_id: id });
    if (typeof data === 'string' && data) cilj = data;
  }
  return NextResponse.redirect(new URL(cilj, request.url), 302);
}

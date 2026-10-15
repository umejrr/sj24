import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_KEY, imaSupabase } from '@/lib/supabase/env';

// 1) firma.sj24.com → stranica firme /firma/firma
// 2) /admin → osvežava prijavu u CMS (kolačiće)
const GLAVNI_DOMEN = 'sj24.com';
const REZERVISANO = new Set(['www', 'admin', 'api', 'mail']);

export async function middleware(request) {
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (host.endsWith(`.${GLAVNI_DOMEN}`)) {
    const poddomen = host.slice(0, -(GLAVNI_DOMEN.length + 1));
    if (poddomen && !poddomen.includes('.') && !REZERVISANO.has(poddomen) && pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/firma/${poddomen}`;
      return NextResponse.rewrite(url);
    }
  }

  if (!pathname.startsWith('/admin') || !imaSupabase) return NextResponse.next();

  let response = NextResponse.next({ request });
  const sb = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await sb.auth.getUser();

  if (!user && pathname !== '/admin/prijava') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/prijava';
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)'],
};

import { redirect } from 'next/navigation';
import CmsNav from '@/components/admin/CmsNav';
import { imaSupabase } from '@/lib/supabase/env';
import { proveriAdmina } from '@/lib/supabase/server';
import { odjava } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }) {
  if (!imaSupabase) return <PovezivanjeBaze />;

  const { sb, user, admin } = await proveriAdmina();
  if (!user) redirect('/admin/prijava');
  if (!admin) {
    return (
      <main className="clogin">
        <div className="clogin-card">
          <h1>Nemaš pristup</h1>
          <p>Nalog <strong>{user.email}</strong> nije upisan kao administrator. Dodaj ga u tabelu <code>admini</code> u Supabase bazi.</p>
          <form action={odjava}><button className="cbtn">Odjava</button></form>
        </div>
      </main>
    );
  }

  const [oglasi, komentari] = await Promise.all([
    sb.from('oglasi').select('id', { count: 'exact', head: true }).eq('status', 'na_cekanju'),
    sb.from('komentari').select('id', { count: 'exact', head: true }).eq('status', 'na_cekanju'),
  ]);

  return (
    <div className="cms">
      <CmsNav email={user.email} brojaci={{ oglasi: oglasi.count ?? 0, komentari: komentari.count ?? 0 }} />
      <main className="cmain">{children}</main>
    </div>
  );
}

function PovezivanjeBaze() {
  return (
    <main className="clogin">
      <div className="clogin-card wide">
        <h1>Poveži bazu da bi CMS radio</h1>
        <ol className="csteps">
          <li>Na <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a> otvori projekat <strong>sj24</strong>.</li>
          <li>U <strong>SQL Editor</strong> nalepi ceo fajl <code>supabase/schema.sql</code> iz GitHub repoa, upiši svoj email u poslednji red i klikni <strong>Run</strong>.</li>
          <li>U <strong>Authentication → Users → Add user</strong> napravi nalog sa istim emailom i lozinkom.</li>
          <li>U <strong>Project Settings → API</strong> kopiraj <em>Project URL</em> i <em>anon/publishable</em> ključ.</li>
          <li>Na Vercelu: <strong>Settings → Environment Variables</strong> dodaj <code>NEXT_PUBLIC_SUPABASE_URL</code> i <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, pa <strong>Redeploy</strong>.</li>
        </ol>
        <p className="chint">Do tada sajt prikazuje probne podatke.</p>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { imaSupabase } from '@/lib/supabase/env';
import { browserKlijent } from '@/lib/supabase/browser';

export default function Prijava() {
  const router = useRouter();
  const [greska, setGreska] = useState('');
  const [salje, setSalje] = useState(false);

  async function prijavi(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSalje(true);
    setGreska('');
    const { error } = await browserKlijent().auth.signInWithPassword({
      email: String(fd.get('email')).trim(),
      password: String(fd.get('lozinka')),
    });
    if (error) {
      setGreska(error.message === 'Invalid login credentials' ? 'Pogrešan email ili lozinka.' : error.message);
      setSalje(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <main className="clogin">
      <form className="clogin-card" onSubmit={prijavi}>
        <div className="cnav-logo big"><span className="sj">SJ</span><span className="n24">24</span></div>
        <h1>Prijava u CMS</h1>
        {!imaSupabase && (
          <div className="cnotice err">Baza još nije povezana. Pogledaj uputstvo u README fajlu (korak „Supabase").</div>
        )}
        {greska && <div className="cnotice err" role="alert">{greska}</div>}
        <div className="cfield">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="cfield">
          <label htmlFor="lozinka">Lozinka</label>
          <input id="lozinka" name="lozinka" type="password" autoComplete="current-password" required />
        </div>
        <button className="cbtn primary block" disabled={salje || !imaSupabase}>{salje ? 'Prijavljujem…' : 'Prijavi se'}</button>
        <a href="/" className="chint">← Nazad na sajt</a>
      </form>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GRUPE, SEKCIJE } from '@/lib/cms';
import { odjava } from '@/app/admin/actions';

export default function CmsNav({ email, brojaci = {} }) {
  const putanja = usePathname();
  const aktivna = (href) => (href === '/admin' ? putanja === '/admin' : putanja.startsWith(href));

  return (
    <aside className="cnav">
      <div className="cnav-head">
        <Link href="/admin" className="cnav-logo" aria-label="CMS početna">
          <span className="sj">SJ</span><span className="n24">24</span>
        </Link>
        <span className="cnav-sub">CMS</span>
      </div>

      <nav className="cnav-links" aria-label="Sekcije CMS-a">
        <Link href="/admin" className={aktivna('/admin') ? 'on' : undefined}>Pregled</Link>
        {GRUPE.map((g) => (
          <div key={g.naslov} className="cnav-group">
            <span className="cnav-group-title">{g.naslov}</span>
            {g.sekcije.map((k) => {
              const href = `/admin/${k}`;
              return (
                <Link key={k} href={href} className={aktivna(href) ? 'on' : undefined}>
                  {SEKCIJE[k].naslov}
                  {brojaci[k] > 0 && <span className="cbadge" aria-label={`${brojaci[k]} na čekanju`}>{brojaci[k]}</span>}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="cnav-group">
          <span className="cnav-group-title">Sajt</span>
          <Link href="/admin/podesavanja" className={aktivna('/admin/podesavanja') ? 'on' : undefined}>Podešavanja</Link>
          <a href="/" target="_blank" rel="noopener">Otvori sajt ↗</a>
        </div>
      </nav>

      <div className="cnav-foot">
        <span title={email}>{email}</span>
        <form action={odjava}><button className="cbtn ghost sm">Odjava</button></form>
      </div>
    </aside>
  );
}

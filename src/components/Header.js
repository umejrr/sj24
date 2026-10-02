import Link from 'next/link';
import Logo from './Logo';
import AdSlot from './AdSlot';
import { IconSearch } from './Icons';
import { rubrike, tickerVesti } from '@/lib/data';
import { danasnjiDatum } from '@/lib/format';

export default function Header({ aktivno = 'vesti' }) {
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>{danasnjiDatum()} · Sjenica <strong>6°C</strong> oblačno</span>
          <div className="topbar-links">
            <a href="#">Facebook</a>
            <a href="#">Oglašavanje</a>
            <a href="#">Kontakt</a>
            <a href="#" className="btn-login">Prijava</a>
          </div>
        </div>
      </div>

      <header className="masthead">
        <div className="container">
          <Logo size="lg" />
          <AdSlot format="leaderboard" title="[Udarni baner · Premium oglašivač]" />
        </div>
      </header>

      <nav className="mainnav" aria-label="Glavni meni">
        <div className="container">
          <div className="mainnav-links no-scrollbar">
            <Link href="/" className={`primary${aktivno === 'vesti' ? ' active' : ''}`}>Vesti</Link>
            <Link href="/aktuelno" className={`primary${aktivno === 'aktuelno' ? ' active' : ''}`}>Aktuelno</Link>
            <span className="sep" aria-hidden="true" />
            {rubrike.map((r) => (
              <Link key={r.slug} href={`/rubrika/${r.slug}`} className={aktivno === r.slug ? 'active' : undefined}>{r.naziv}</Link>
            ))}
            <span className="sep" aria-hidden="true" />
            <Link href="/oglasi" className={`primary${aktivno === 'oglasi' ? ' active' : ''}`}>Mali oglasi</Link>
            <Link href="/firme" className={`primary${aktivno === 'firme' ? ' active' : ''}`}>Firme</Link>
            <Link href="/servis" className={`primary${aktivno === 'servis' ? ' active' : ''}`}>Servis</Link>
          </div>
          <button className="search" aria-label="Pretraga"><IconSearch /></button>
        </div>
      </nav>

      <div className="ticker">
        <div className="container">
          <span className="ticker-label">NAJNOVIJE</span>
          <span className="ticker-text">{tickerVesti.join(' · ')}</span>
        </div>
      </div>
    </>
  );
}

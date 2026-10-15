import Link from 'next/link';
import Logo from './Logo';
import AdSlot from './AdSlot';
import { IconSearch } from './Icons';
import { getRubrike, getTicker, getPodesavanja } from '@/lib/db';
import { getVreme } from '@/lib/vreme';
import { danasnjiDatum } from '@/lib/format';

export default async function Header({ aktivno = 'vesti' }) {
  const [rubrike, ticker, p, vreme] = await Promise.all([getRubrike(), getTicker(), getPodesavanja(), getVreme()]);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            {danasnjiDatum()}
            {vreme && <> · Sjenica <strong>{vreme.temp}°C</strong> {vreme.opis.toLowerCase()}</>}
          </span>
          <div className="topbar-links">
            {p.facebook_url && <a href={p.facebook_url} target="_blank" rel="noopener noreferrer">Facebook</a>}
            <Link href="/oglasavanje">Oglašavanje</Link>
            <Link href="/oglasavanje#kontakt">Kontakt</Link>
          </div>
        </div>
      </div>

      <header className="masthead">
        <div className="container">
          <Logo size="lg" />
          <AdSlot pozicija="leaderboard" format="leaderboard" />
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

      {ticker.length > 0 && (
        <div className="ticker">
          <div className="container">
            <span className="ticker-label">NAJNOVIJE</span>
            <span className="ticker-text">{ticker.join(' · ')}</span>
          </div>
        </div>
      )}
    </>
  );
}

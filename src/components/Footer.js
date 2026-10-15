import Link from 'next/link';
import Logo from './Logo';
import { getPodesavanja } from '@/lib/db';

export default async function Footer() {
  const p = await getPodesavanja();
  return (
    <footer className="footer">
      <div className="container footer-cols">
        <div className="footer-col about">
          <Logo size="sm" inverse tagline={false} />
          <span>{p.o_nama}</span>
          {p.facebook_url && <a href={p.facebook_url} target="_blank" rel="noopener noreferrer">Facebook</a>}
        </div>
        <div className="footer-col">
          <span className="h">Rubrike</span>
          <Link href="/">Vesti</Link>
          <Link href="/aktuelno">Aktuelno</Link>
          <Link href="/oglasi">Mali oglasi</Link>
          <Link href="/firme">Imenik firmi</Link>
          <Link href="/servis">Servis</Link>
        </div>
        <div className="footer-col">
          <span className="h">Za firme</span>
          <Link href="/oglasavanje">Paketi i oglašavanje</Link>
          <Link href="/oglasi#predaj">Predaj mali oglas</Link>
        </div>
        <div className="footer-col">
          <span className="h">Kontakt</span>
          {p.kontakt_email && <a href={`mailto:${p.kontakt_email}`}>{p.kontakt_email}</a>}
          {p.kontakt_telefon && <a href={`tel:${p.kontakt_telefon.replace(/\s/g, '')}`}>{p.kontakt_telefon}</a>}
          <Link href="/oglasavanje#kontakt">Piši redakciji</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} SJ24 · sj24.com</div>
      </div>
    </footer>
  );
}

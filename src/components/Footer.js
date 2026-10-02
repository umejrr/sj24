import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-cols">
        <div className="footer-col about">
          <Logo size="sm" inverse tagline={false} />
          <span>Lokalni portal Sjenice i Peštera. Vesti, oglasi i firme na jednom mestu.</span>
        </div>
        <div className="footer-col">
          <span className="h">Rubrike</span>
          <Link href="/">Vesti</Link>
          <Link href="/aktuelno">Aktuelno</Link>
          <Link href="/oglasi">Mali oglasi</Link>
          <Link href="/firme">Imenik firmi</Link>
        </div>
        <div className="footer-col">
          <span className="h">Za firme</span>
          <a href="#">Paketi i cene</a>
          <a href="#">Stranica firme</a>
          <a href="#">Baneri</a>
        </div>
        <div className="footer-col">
          <span className="h">Portal</span>
          <a href="#">O nama</a>
          <a href="#">Impresum</a>
          <a href="#">Pravila korišćenja</a>
          <a href="#">Privatnost</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} SJ24 · sj24.com</div>
      </div>
    </footer>
  );
}

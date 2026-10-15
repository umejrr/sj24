import Link from 'next/link';
import Photo from './Photo';

export default function FirmaKartica({ f }) {
  return (
    <Link href={`/firma/${f.slug}`} className={`firm${f.paket === 'premium' ? ' premium' : ''}`}>
      <Photo src={f.logo_url} alt={f.naziv} label="Logo" />
      <span className="card-body">
        <span className="n">{f.naziv}</span>
        <span className="c">{f.kategorija}</span>
        <span className="d">{f.slug}.sj24.com</span>
      </span>
      {f.paket === 'premium' && <span className="ribbon">PREMIUM</span>}
    </Link>
  );
}

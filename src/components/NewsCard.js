import Link from 'next/link';
import Photo from './Photo';
import { nazivRubrike } from '@/lib/data';
import { formatKratko } from '@/lib/format';

export function NewsCard({ vest }) {
  return (
    <Link href={`/vesti/${vest.slug}`} className="news-card">
      <Photo />
      <span className="card-body">
        <span className="kicker">{nazivRubrike(vest.rubrika)}</span>
        <h3>{vest.naslov}</h3>
        <span className="meta">{formatKratko(vest.datum)}</span>
      </span>
    </Link>
  );
}

// Sponzorisana kartica koja izgleda kao vest (native ad), sa jasnom oznakom.
export function SponsoredCard({ naslov = '[Naslov sponzorisane poruke firme]', domen = 'firma.sj24.com' }) {
  return (
    <a href="#" className="news-card sponsored">
      <Photo label="[Fotografija firme]" />
      <span className="card-body">
        <span className="sponsored-label">SPONZORISANO</span>
        <h3>{naslov}</h3>
        <span className="sponsored-link">{domen}</span>
      </span>
    </a>
  );
}

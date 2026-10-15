import Link from 'next/link';
import Photo from './Photo';
import { BrojacPrikaza } from './Brojaci';
import { nazivRubrike, reklama } from '@/lib/db';
import { formatKratko } from '@/lib/format';

export async function NewsCard({ vest }) {
  const rubrika = await nazivRubrike(vest.rubrika);
  return (
    <Link href={`/vesti/${vest.slug}`} className="news-card">
      <Photo src={vest.slika_url} alt={vest.naslov} />
      <span className="card-body">
        {rubrika && <span className="kicker">{rubrika}</span>}
        <h3>{vest.naslov}</h3>
        <span className="meta">{formatKratko(vest.datum)}</span>
      </span>
    </Link>
  );
}

// Sponzorisana kartica među vestima (CMS → Reklame, pozicija „Sponzorisana kartica").
export async function SponsoredCard() {
  const r = await reklama('native');
  if (!r) {
    return (
      <Link href="/oglasavanje" className="news-card sponsored">
        <Photo label="Vaša firma ovde" />
        <span className="card-body">
          <span className="sponsored-label">SPONZORISANO</span>
          <h3>Predstavite svoju firmu čitaocima iz Sjenice i Peštera</h3>
          <span className="sponsored-link">Saznajte više</span>
        </span>
      </Link>
    );
  }
  const naslov = r.naslov || r.firma?.naziv || '';
  return (
    <a href={`/r/${r.id}`} className="news-card sponsored" rel="sponsored noopener">
      <Photo src={r.slika_url || r.firma?.logo_url} alt={naslov} />
      <span className="card-body">
        <span className="sponsored-label">SPONZORISANO</span>
        <h3>{naslov}</h3>
        {r.firma?.slug && <span className="sponsored-link">{r.firma.slug}.sj24.com</span>}
      </span>
      <BrojacPrikaza id={r.id} />
    </a>
  );
}

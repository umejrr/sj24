import Link from 'next/link';
import { reklama as izaberiReklamu } from '@/lib/db';
import { BrojacPrikaza } from './Brojaci';

// Reklamno mesto. Prikazuje aktivnu reklamu za tu poziciju (iz CMS-a → Reklame),
// a ako je nema — poziv firmama da se reklamiraju.
const formati = {
  leaderboard: { cls: 'ad-leaderboard', size: '728 × 90', label: 'SPONZORISANO' },
  rect: { cls: 'ad-rect', size: '300 × 250', label: 'REKLAMA' },
  tall: { cls: 'ad-tall', size: '300 × 600', label: 'REKLAMA' },
};

export default async function AdSlot({ pozicija, format = 'rect' }) {
  const f = formati[format];
  const r = pozicija ? await izaberiReklamu(pozicija) : null;

  if (!r) {
    return (
      <Link href="/oglasavanje" className={`ad ${f.cls}`}>
        <span className="ad-label">{f.label}</span>
        <span className="ad-title">Mesto za vašu reklamu</span>
        <span className="ad-size">{f.size} · Saznajte više</span>
      </Link>
    );
  }

  const opis = r.naslov || r.firma?.naziv || 'Reklama';
  return (
    <a href={`/r/${r.id}`} className={`ad ad-live ${f.cls}`} rel="sponsored noopener" aria-label={opis}>
      <span className="ad-label">{f.label}</span>
      {r.video_url
        ? <video src={r.video_url} autoPlay muted loop playsInline preload="metadata" poster={r.slika_url || undefined} />
        : r.slika_url
          ? <img src={r.slika_url} alt={opis} loading="lazy" />
          : <span className="ad-title">{opis}</span>}
      <BrojacPrikaza id={r.id} />
    </a>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Photo from '@/components/Photo';
import AdSlot from '@/components/AdSlot';
import { NewsCard, SponsoredCard } from '@/components/NewsCard';
import { BrojacPregleda } from '@/components/Brojaci';
import { getVest, nazivRubrike, getPovezane, getKomentari, pasusi } from '@/lib/db';
import { formatDatum, formatKratko } from '@/lib/format';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = await getVest(slug);
  if (!v) return {};
  return {
    title: v.naslov,
    description: v.uvod ?? undefined,
    openGraph: { title: v.naslov, description: v.uvod ?? undefined, type: 'article', images: v.slika_url ? [v.slika_url] : undefined },
  };
}

export default async function VestStrana({ params }) {
  const { slug } = await params;
  const v = await getVest(slug);
  if (!v) notFound();
  const [rubrika, povezane, komentari] = await Promise.all([nazivRubrike(v.rubrika), getPovezane(v, 2), getKomentari(v.id)]);
  const link = `https://sj24.com/vesti/${v.slug}`;

  return (
    <>
      <Header aktivno={v.rubrika} />
      <BrojacPregleda slug={v.slug} />
      <main className="container page">
        <div className="page-main">
          <article className="article">
            <nav className="breadcrumbs" aria-label="Putanja">
              <Link href="/">Vesti</Link>
              {rubrika && <><span aria-hidden="true">/</span><Link href={`/rubrika/${v.rubrika}`}>{rubrika}</Link></>}
            </nav>
            <h1>{v.naslov}</h1>
            {v.uvod && <p className="lead">{v.uvod}</p>}
            <span className="meta">{formatDatum(v.datum)} · {v.autor || 'Redakcija SJ24'}</span>
            {v.slika_url && (
              <figure className="article-figure">
                <Photo className="photo-lg" src={v.slika_url} alt={v.slika_opis || v.naslov} />
                {v.slika_opis && <figcaption>{v.slika_opis}</figcaption>}
              </figure>
            )}
            <div className="article-body">
              {pasusi(v.tekst).map((p, k) => <p key={k}>{p}</p>)}
            </div>
            <div className="share">
              <span>Podeli:</span>
              <a className="btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a className="btn" href={`viber://forward?text=${encodeURIComponent(link)}`}>Viber</a>
            </div>
          </article>

          <AdSlot pozicija="ispod_vesti" format="rect" />

          {povezane.length > 0 && (
            <section className="section">
              <div className="section-head">
                <h2>Još iz rubrike {rubrika}</h2>
                <Link href={`/rubrika/${v.rubrika}`} className="more">Sve</Link>
              </div>
              <div className="news-grid">
                {povezane.map((x) => <NewsCard key={x.slug} vest={x} />)}
                <SponsoredCard />
              </div>
            </section>
          )}

          <section className="section" id="komentari">
            <div className="section-head"><h2>Komentari{komentari.length ? ` (${komentari.length})` : ''}</h2></div>
            {komentari.length > 0 && (
              <ul className="comments">
                {komentari.map((c) => (
                  <li key={c.id}>
                    <span className="who">{c.ime}</span>
                    <span className="meta">{formatKratko(c.created_at)}</span>
                    <p>{c.tekst}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="empty">Komentarisanje uskoro: prijava preko Google ili Facebook naloga. Komentari se objavljuju nakon odobrenja redakcije.</div>
          </section>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

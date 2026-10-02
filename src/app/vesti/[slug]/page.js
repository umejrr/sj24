import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Photo from '@/components/Photo';
import AdSlot from '@/components/AdSlot';
import { NewsCard, SponsoredCard } from '@/components/NewsCard';
import { vesti, vestPoSlugu, nazivRubrike, povezaneVesti } from '@/lib/data';
import { formatDatum } from '@/lib/format';

export const revalidate = 300;

export function generateStaticParams() {
  return vesti.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = vestPoSlugu(slug);
  if (!v) return {};
  return { title: v.naslov, description: v.uvod, openGraph: { title: v.naslov, description: v.uvod, type: 'article' } };
}

export default async function VestStrana({ params }) {
  const { slug } = await params;
  const v = vestPoSlugu(slug);
  if (!v) notFound();
  const povezane = povezaneVesti(v, 2);

  return (
    <>
      <Header aktivno={v.rubrika} />
      <main className="container page">
        <div className="page-main">
          <article className="article">
            <nav className="breadcrumbs" aria-label="Putanja">
              <Link href="/">Vesti</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/rubrika/${v.rubrika}`}>{nazivRubrike(v.rubrika)}</Link>
            </nav>
            <h1>{v.naslov}</h1>
            <p className="lead">{v.uvod}</p>
            <span className="meta">{formatDatum(v.datum)} · Redakcija SJ24</span>
            <Photo className="photo-lg" label="[Fotografija vesti]" />
            <div className="article-body">
              {v.tekst.map((p, k) => <p key={k}>{p}</p>)}
            </div>
            <div className="share">
              <span>Podeli:</span>
              <a className="btn" href={`https://www.facebook.com/sharer/sharer.php?u=https://sj24.com/vesti/${v.slug}`} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a className="btn" href={`viber://forward?text=https://sj24.com/vesti/${v.slug}`}>Viber</a>
            </div>
          </article>

          <AdSlot format="rect" label="REKLAMA" title="[Baner firme ispod vesti]" />

          <section className="section">
            <div className="section-head">
              <h2>Još iz rubrike {nazivRubrike(v.rubrika)}</h2>
              <Link href={`/rubrika/${v.rubrika}`} className="more">Sve</Link>
            </div>
            <div className="news-grid">
              {povezane.map((x) => <NewsCard key={x.slug} vest={x} />)}
              <SponsoredCard />
            </div>
          </section>

          <section className="section" id="komentari">
            <div className="section-head"><h2>Komentari</h2></div>
            <div className="empty">Komentarisanje je dostupno prijavljenim korisnicima. Komentari se objavljuju nakon odobrenja redakcije.</div>
          </section>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

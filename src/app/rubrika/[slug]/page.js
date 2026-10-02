import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';
import { NewsCard, SponsoredCard } from '@/components/NewsCard';
import { rubrike, vestiRubrike, nazivRubrike } from '@/lib/data';

const PO_STRANI = 9;

export function generateStaticParams() {
  return rubrike.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: nazivRubrike(slug) };
}

export default async function RubrikaStrana({ params, searchParams }) {
  const { slug } = await params;
  if (!rubrike.some((r) => r.slug === slug)) notFound();
  const sp = await searchParams;
  const sve = vestiRubrike(slug);
  const ukupno = Math.max(1, Math.ceil(sve.length / PO_STRANI));
  const strana = Math.min(ukupno, Math.max(1, Number(sp?.strana) || 1));
  const naStrani = sve.slice((strana - 1) * PO_STRANI, strana * PO_STRANI);

  return (
    <>
      <Header aktivno={slug} />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head"><h2>{nazivRubrike(slug)}</h2></div>
            {naStrani.length ? (
              <div className="news-grid">
                {naStrani.map((v) => <NewsCard key={v.slug} vest={v} />)}
                <SponsoredCard />
              </div>
            ) : (
              <div className="empty">U ovoj rubrici još nema vesti.</div>
            )}
          </section>
          <Pagination strana={strana} ukupno={ukupno} osnova={`/rubrika/${slug}`} />
        </div>
        <Sidebar />
      </main>
    </>
  );
}

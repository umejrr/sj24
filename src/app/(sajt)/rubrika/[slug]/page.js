import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';
import { NewsCard, SponsoredCard } from '@/components/NewsCard';
import { getRubrike, getVestiRubrike } from '@/lib/db';

const PO_STRANI = 12;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = (await getRubrike()).find((x) => x.slug === slug);
  return { title: r?.naziv ?? 'Rubrika' };
}

export default async function RubrikaStrana({ params, searchParams }) {
  const { slug } = await params;
  const rubrika = (await getRubrike()).find((x) => x.slug === slug);
  if (!rubrika) notFound();
  const sp = await searchParams;
  const strana = Math.max(1, Number(sp?.strana) || 1);
  const { vesti, ukupno } = await getVestiRubrike(slug, strana, PO_STRANI);
  const brojStrana = Math.max(1, Math.ceil(ukupno / PO_STRANI));

  return (
    <>
      <Header aktivno={slug} />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head"><h2>{rubrika.naziv}</h2></div>
            {vesti.length ? (
              <div className="news-grid">
                {vesti.slice(0, 6).map((v) => <NewsCard key={v.slug} vest={v} />)}
                <SponsoredCard />
                {vesti.slice(6).map((v) => <NewsCard key={v.slug} vest={v} />)}
              </div>
            ) : (
              <div className="empty">U ovoj rubrici još nema vesti.</div>
            )}
          </section>
          <Pagination strana={strana} ukupno={brojStrana} osnova={`/rubrika/${slug}`} />
        </div>
        <Sidebar />
      </main>
    </>
  );
}

import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { NewsCard } from '@/components/NewsCard';
import { getVestiTema } from '@/lib/db';

export const revalidate = 60;
export const metadata = { title: 'Aktuelno' };

export default async function Aktuelno() {
  const teme = await getVestiTema();
  return (
    <>
      <Header aktivno="aktuelno" />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head">
              <h2>Aktuelno</h2>
              <span className="sub">Teme o kojima se priča danima</span>
            </div>
            {teme.length === 0 && <div className="empty">Trenutno nema aktuelnih tema.</div>}
          </section>

          {teme.map((t) => (
            <section key={t.slug} id={t.slug} className="section topic-section">
              <div className="topic-head">
                <h2>{t.naslov}</h2>
                {t.opis && <p>{t.opis}</p>}
              </div>
              {t.vesti.length ? (
                <div className="news-grid">
                  {t.vesti.slice(0, 6).map((v) => <NewsCard key={v.slug} vest={v} />)}
                </div>
              ) : (
                <div className="empty">Uskoro tekstovi o ovoj temi. <Link href="/">Najnovije vesti</Link></div>
              )}
            </section>
          ))}
        </div>
        <Sidebar />
      </main>
    </>
  );
}

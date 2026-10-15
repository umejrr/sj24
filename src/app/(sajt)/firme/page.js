import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FirmaKartica from '@/components/FirmaKartica';
import { getFirme } from '@/lib/db';
import { KATEGORIJE_FIRMI } from '@/lib/konstante';

export const metadata = { title: 'Imenik firmi' };

export default async function Firme({ searchParams }) {
  const sp = await searchParams;
  const kategorija = KATEGORIJE_FIRMI.includes(sp?.kategorija) ? sp.kategorija : null;
  const firme = await getFirme(kategorija);

  return (
    <>
      <Header aktivno="firme" />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head">
              <h2>Imenik firmi</h2>
              <Link href="/oglasavanje" className="more">Dodaj svoju firmu</Link>
            </div>
            <div className="chips">
              <Link href="/firme" className={`chip${!kategorija ? ' active' : ''}`}>Sve</Link>
              {KATEGORIJE_FIRMI.map((k) => (
                <Link key={k} href={`/firme?kategorija=${encodeURIComponent(k)}`} className={`chip${kategorija === k ? ' active' : ''}`}>{k}</Link>
              ))}
            </div>
            {firme.length ? (
              <div className="firms">
                {firme.map((f) => <FirmaKartica key={f.slug} f={f} />)}
              </div>
            ) : (
              <div className="empty">U ovoj kategoriji još nema firmi.</div>
            )}
          </section>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

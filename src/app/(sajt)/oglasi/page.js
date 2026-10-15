import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Photo from '@/components/Photo';
import Pagination from '@/components/Pagination';
import OglasForma from '@/components/OglasForma';
import { getOglasi } from '@/lib/db';
import { KATEGORIJE_OGLASA } from '@/lib/konstante';
import { formatKratko } from '@/lib/format';

export const metadata = { title: 'Mali oglasi' };
const PO_STRANI = 24;

export default async function Oglasi({ searchParams }) {
  const sp = await searchParams;
  const kategorija = KATEGORIJE_OGLASA.includes(sp?.kategorija) ? sp.kategorija : null;
  const strana = Math.max(1, Number(sp?.strana) || 1);
  const { oglasi, ukupno } = await getOglasi({ kategorija, strana, poStrani: PO_STRANI });
  const osnova = kategorija ? `/oglasi?kategorija=${encodeURIComponent(kategorija)}` : '/oglasi';

  return (
    <>
      <Header aktivno="oglasi" />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head">
              <h2>Mali oglasi</h2>
              <a href="#predaj" className="btn btn-accent">Predaj oglas</a>
            </div>
            <div className="chips">
              <Link href="/oglasi" className={`chip${!kategorija ? ' active' : ''}`}>Svi</Link>
              {KATEGORIJE_OGLASA.map((k) => (
                <Link key={k} href={`/oglasi?kategorija=${encodeURIComponent(k)}`} className={`chip${kategorija === k ? ' active' : ''}`}>{k}</Link>
              ))}
            </div>
            {oglasi.length ? (
              <div className="classifieds">
                {oglasi.map((o) => (
                  <Link key={o.id} href={`/oglasi/${o.id}`} className="classified">
                    <Photo src={o.slika_url} alt={o.naslov} />
                    <span className="body">
                      <span className="kicker">{o.kategorija}</span>
                      <span className="t">{o.naslov}</span>
                      {o.cena && <span className="p">{o.cena}</span>}
                      <span className="meta">{[o.mesto, formatKratko(o.created_at)].filter(Boolean).join(' · ')}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty">Nema oglasa u ovoj kategoriji.</div>
            )}
          </section>

          <Pagination strana={strana} ukupno={Math.max(1, Math.ceil(ukupno / PO_STRANI))} osnova={osnova} />

          <section className="section" id="predaj">
            <div className="section-head"><h2>Predaj besplatan oglas</h2></div>
            <OglasForma />
          </section>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

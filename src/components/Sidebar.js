import Link from 'next/link';
import Weather from './Weather';
import AdSlot from './AdSlot';
import Photo from './Photo';
import { getNajcitanije, getPreporucena, nazivRubrike } from '@/lib/db';

export default async function Sidebar() {
  const [pop, prep] = await Promise.all([getNajcitanije(), getPreporucena()]);
  const prepRubrika = prep ? await nazivRubrike(prep.rubrika) : '';
  return (
    <aside className="page-aside">
      <Weather />
      <AdSlot pozicija="sidebar_1" format="rect" />

      {pop.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Najčitanije</h2></div>
          <ol className="ranked">
            {pop.map((v, k) => (
              <li key={v.slug}>
                <Link href={`/vesti/${v.slug}`}>
                  <span className="n">{k + 1}</span>
                  <span className="t">{v.naslov}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <AdSlot pozicija="sidebar_2" format="rect" />

      {prep && (
        <section className="section">
          <div className="section-head"><h2>Preporučeno</h2></div>
          <Link href={`/vesti/${prep.slug}`} className="news-card">
            <Photo src={prep.slika_url} alt={prep.naslov} />
            <span className="card-body">
              {prepRubrika && <span className="kicker">{prepRubrika}</span>}
              <h3>{prep.naslov}</h3>
            </span>
          </Link>
        </section>
      )}

      <AdSlot pozicija="sidebar_3" format="tall" />
    </aside>
  );
}

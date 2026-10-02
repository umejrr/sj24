import Link from 'next/link';
import Weather from './Weather';
import AdSlot from './AdSlot';
import Photo from './Photo';
import { najcitanijeVesti, preporucenaVest, nazivRubrike } from '@/lib/data';

export default function Sidebar() {
  const pop = najcitanijeVesti();
  const prep = preporucenaVest();
  return (
    <aside className="page-aside">
      <Weather />
      <AdSlot format="rect" label="REKLAMA 1" />

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

      <AdSlot format="rect" label="REKLAMA 2" title="[Video reklama · bez zvuka]" />

      <section className="section">
        <div className="section-head"><h2>Preporučeno</h2></div>
        <Link href={`/vesti/${prep.slug}`} className="news-card">
          <Photo />
          <span className="card-body">
            <span className="kicker">{nazivRubrike(prep.rubrika)}</span>
            <h3>{prep.naslov}</h3>
          </span>
        </Link>
      </section>

      <AdSlot format="tall" label="REKLAMA 3" title="[Visoki baner]" />
    </aside>
  );
}

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Photo from '@/components/Photo';
import { getServis } from '@/lib/db';
import { SERVIS_TIPOVI } from '@/lib/konstante';
import { formatDan } from '@/lib/format';

export const revalidate = 60;
export const metadata = { title: 'Servis' };

export default async function Servis() {
  const po = await getServis();
  return (
    <>
      <Header aktivno="servis" />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head"><h2>Servis</h2></div>
            <div className="chips">
              {SERVIS_TIPOVI.map(([k, naziv]) => <a key={k} href={`#${k}`} className="chip">{naziv}</a>)}
            </div>
          </section>

          {SERVIS_TIPOVI.map(([k, naziv]) => (
            <section key={k} id={k} className="section">
              <div className="section-head"><h2>{naziv}</h2></div>
              {po[k].length ? (
                <ul className={`service-list${k === 'citulje' ? ' obits' : ''}`}>
                  {po[k].map((s) => (
                    <li key={s.id}>
                      {k === 'citulje' && <Photo src={s.slika_url} alt={s.naslov} />}
                      <div>
                        <span className="meta">{formatDan(s.datum)}</span>
                        <h3>{s.naslov}</h3>
                        {s.tekst && <p className="pre">{s.tekst}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty">Trenutno nema obaveštenja.</div>
              )}
            </section>
          ))}
        </div>
        <Sidebar />
      </main>
    </>
  );
}

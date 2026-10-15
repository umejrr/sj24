import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { getPodesavanja } from '@/lib/db';
import { PAKETI } from '@/lib/konstante';

export const revalidate = 60;
export const metadata = { title: 'Oglašavanje' };

const opisPaketa = {
  osnovni: 'Stranica firme na adresi vasafirma.sj24.com: opis, kontakt, mapa, radno vreme i galerija. Mesto u imeniku firmi.',
  standard: 'Sve iz osnovnog paketa, plus reklama u desnoj koloni portala.',
  premium: 'Sve iz standardnog, plus istaknuto mesto u imeniku, oznaka PREMIUM i udarni baner ili sponzorisana kartica među vestima.',
};

export default async function Oglasavanje() {
  const p = await getPodesavanja();
  return (
    <>
      <Header aktivno="" />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head"><h2>Oglašavanje na SJ24</h2></div>
            {p.oglasavanje && <p className="lead-sm pre">{p.oglasavanje}</p>}
            <div className="packages">
              {PAKETI.map(([k, naziv]) => (
                <div key={k} className={`package${k === 'premium' ? ' premium' : ''}`}>
                  <h3>{naziv}</h3>
                  <p>{opisPaketa[k]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section" id="kontakt">
            <div className="section-head"><h2>Kontakt</h2></div>
            <div className="contact-card">
              {p.kontakt_telefon && <a className="btn btn-accent" href={`tel:${p.kontakt_telefon.replace(/\s/g, '')}`}>Pozovi {p.kontakt_telefon}</a>}
              {p.kontakt_email && <a className="btn" href={`mailto:${p.kontakt_email}`}>{p.kontakt_email}</a>}
              {!p.kontakt_telefon && !p.kontakt_email && <p>Kontakt podaci uskoro.</p>}
            </div>
          </section>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

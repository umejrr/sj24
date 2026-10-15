import Link from 'next/link';
import { notFound } from 'next/navigation';
import Photo from '@/components/Photo';
import Logo from '@/components/Logo';
import { getFirma } from '@/lib/db';
import { labela, PAKETI } from '@/lib/konstante';

// Stranica firme: sj24.com/firma/ime  (kasnije i ime.sj24.com)
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const f = await getFirma(slug);
  if (!f) return {};
  return {
    title: f.naziv,
    description: f.kratak_opis ?? undefined,
    openGraph: { title: f.naziv, description: f.kratak_opis ?? undefined, images: f.naslovna_url || f.logo_url ? [f.naslovna_url || f.logo_url] : undefined },
  };
}

export default async function FirmaStrana({ params }) {
  const { slug } = await params;
  const f = await getFirma(slug);
  if (!f) notFound();
  const galerija = Array.isArray(f.galerija) ? f.galerija.filter(Boolean) : [];
  const mapa = f.adresa ? `https://www.google.com/maps?q=${encodeURIComponent(`${f.adresa}, Sjenica`)}&output=embed` : null;

  return (
    <main className="firm-page">
      <div className="firm-top">
        <div className="container">
          <Logo size="sm" tagline={false} />
          <Link href="/firme" className="more">Imenik firmi</Link>
        </div>
      </div>

      <header className="firm-hero">
        {f.naslovna_url
          ? <img className="firm-cover" src={f.naslovna_url} alt="" />
          : <span className="firm-cover firm-cover-empty" aria-hidden="true" />}
        <div className="container firm-hero-inner">
          <Photo className="firm-logo" src={f.logo_url} alt={`${f.naziv} logo`} label="Logo" />
          <div className="firm-title">
            <span className="kicker">{f.kategorija}{f.paket === 'premium' ? ` · ${labela(PAKETI, f.paket)}` : ''}</span>
            <h1>{f.naziv}</h1>
            {f.kratak_opis && <p>{f.kratak_opis}</p>}
          </div>
        </div>
      </header>

      <div className="container page">
        <div className="page-main">
          {f.opis && (
            <section className="section">
              <div className="section-head"><h2>O nama</h2></div>
              <div className="article-body">
                {String(f.opis).split(/\n\s*\n/).map((p, k) => <p key={k}>{p}</p>)}
              </div>
            </section>
          )}

          {galerija.length > 0 && (
            <section className="section">
              <div className="section-head"><h2>Galerija</h2></div>
              <div className="gallery">
                {galerija.map((src) => (
                  <a key={src} href={src} target="_blank" rel="noopener noreferrer"><img src={src} alt="" loading="lazy" /></a>
                ))}
              </div>
            </section>
          )}

          {mapa && (
            <section className="section">
              <div className="section-head"><h2>Lokacija</h2></div>
              <iframe className="map" src={mapa} title={`Mapa: ${f.naziv}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </section>
          )}
        </div>

        <aside className="page-aside">
          <section className="contact-card">
            <h2>Kontakt</h2>
            {f.telefon && <a className="btn btn-accent" href={`tel:${f.telefon.replace(/\s/g, '')}`}>Pozovi {f.telefon}</a>}
            <dl>
              {f.adresa && (<><dt>Adresa</dt><dd>{f.adresa}</dd></>)}
              {f.email && (<><dt>Email</dt><dd><a href={`mailto:${f.email}`}>{f.email}</a></dd></>)}
              {f.web && (<><dt>Web</dt><dd><a href={f.web} target="_blank" rel="noopener noreferrer">{f.web.replace(/^https?:\/\//, '')}</a></dd></>)}
              {f.radno_vreme && (<><dt>Radno vreme</dt><dd className="pre">{f.radno_vreme}</dd></>)}
            </dl>
          </section>
          <Link href="/" className="btn">Vesti iz Sjenice na SJ24</Link>
        </aside>
      </div>
    </main>
  );
}

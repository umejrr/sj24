import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Photo from '@/components/Photo';
import { getOglas } from '@/lib/db';
import { formatDatum, formatDan } from '@/lib/format';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const o = await getOglas(id);
  return o ? { title: o.naslov } : {};
}

export default async function OglasStrana({ params }) {
  const { id } = await params;
  const o = await getOglas(id);
  if (!o) notFound();

  return (
    <>
      <Header aktivno="oglasi" />
      <main className="container page">
        <div className="page-main">
          <article className="article">
            <nav className="breadcrumbs" aria-label="Putanja">
              <Link href="/oglasi">Mali oglasi</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/oglasi?kategorija=${encodeURIComponent(o.kategorija)}`}>{o.kategorija}</Link>
            </nav>
            <h1>{o.naslov}</h1>
            {o.cena && <p className="price">{o.cena}</p>}
            <span className="meta">{[o.mesto, `objavljeno ${formatDatum(o.created_at)}`, `ističe ${formatDan(o.istice)}`].filter(Boolean).join(' · ')}</span>
            {o.slika_url && <Photo className="photo-lg" src={o.slika_url} alt={o.naslov} />}
            {o.opis && <div className="article-body"><p className="pre">{o.opis}</p></div>}
            <div className="contact-card">
              <h2>Kontakt{o.ime ? `: ${o.ime}` : ''}</h2>
              {o.telefon && <a className="btn btn-accent" href={`tel:${o.telefon.replace(/\s/g, '')}`}>Pozovi {o.telefon}</a>}
              {o.email && <a className="btn" href={`mailto:${o.email}`}>{o.email}</a>}
            </div>
          </article>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HeroCarousel from '@/components/HeroCarousel';
import { NewsCard, SponsoredCard } from '@/components/NewsCard';
import Photo from '@/components/Photo';
import Pagination from '@/components/Pagination';
import { IconPower, IconRoad, IconBus, IconCandle } from '@/components/Icons';
import { istaknuteVesti, najnovijeVesti, aktuelneTeme, oglasi, firme, kategorijeFirmi, nazivRubrike } from '@/lib/data';
import { formatKratko } from '@/lib/format';

// Naslovna se osvežava svakih 5 minuta.
export const revalidate = 300;

export default function Home() {
  const istaknute = istaknuteVesti();
  const slides = istaknute.map((v) => ({
    slug: v.slug,
    naslov: v.naslov,
    uvod: v.uvod,
    rubrikaNaziv: nazivRubrike(v.rubrika),
    vreme: formatKratko(v.datum),
  }));
  const najnovije = najnovijeVesti(5, istaknute.map((v) => v.slug));

  return (
    <>
      <Header aktivno="vesti" />
      <main className="container page">
        <div className="page-main">
          <HeroCarousel slides={slides} />

          <section className="section">
            <div className="section-head">
              <h2>Najnovije vesti</h2>
              <Link href="/rubrika/sjenica" className="more">Sve vesti</Link>
            </div>
            <div className="news-grid">
              {najnovije.map((v) => <NewsCard key={v.slug} vest={v} />)}
              <SponsoredCard />
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Aktuelno</h2>
              <span className="sub">Teme o kojima se priča danima</span>
            </div>
            <div className="topics no-scrollbar">
              {aktuelneTeme.map((t) => (
                <Link key={t.slug} href={`/aktuelno#${t.slug}`} className="topic">
                  <span className="t">{t.naslov}</span>
                  <span className="f">Prati temu</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-head"><h2>Servis</h2></div>
            <div className="tiles">
              <Link href="/servis#struja-voda" className="tile"><IconPower /><span className="t">Struja i voda</span><span className="s">Najave isključenja</span></Link>
              <Link href="/servis#putevi" className="tile"><IconRoad /><span className="t">Stanje na putevima</span><span className="s">Pešter i okolina</span></Link>
              <Link href="/servis#red-voznje" className="tile"><IconBus /><span className="t">Red vožnje</span><span className="s">Autobuske linije</span></Link>
              <Link href="/servis#citulje" className="tile"><IconCandle /><span className="t">Čitulje</span><span className="s">Poslednji pozdravi</span></Link>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Mali oglasi</h2>
              <div className="btn-row">
                <Link href="/oglasi" className="btn">Svi oglasi</Link>
                <Link href="/oglasi#predaj" className="btn btn-accent">Predaj oglas</Link>
              </div>
            </div>
            <div className="classifieds">
              {oglasi.map((o) => (
                <Link key={o.id} href={`/oglasi#oglas-${o.id}`} className="classified">
                  <Photo />
                  <span className="body">
                    <span className="kicker">{o.kategorija}</span>
                    <span className="t">{o.naslov}</span>
                    <span className="p">{o.cena}</span>
                    <span className="meta">{o.datum.split('-').reverse().join('.')}.</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Imenik firmi</h2>
              <div className="chips no-scrollbar">
                <Link href="/firme" className="chip active">Sve</Link>
                {kategorijeFirmi.map((k) => <Link key={k} href={`/firme#${k.toLowerCase()}`} className="chip">{k}</Link>)}
              </div>
            </div>
            <div className="firms">
              {firme.map((f) => (
                <a key={f.slug} href="#" className={`firm${f.paket === 'premium' ? ' premium' : ''}`}>
                  <Photo label="Logo" />
                  <span className="card-body">
                    <span className="n">{f.naziv}</span>
                    <span className="c">{f.kategorija}</span>
                    <span className="d">{f.slug}.sj24.com</span>
                  </span>
                  {f.paket === 'premium' && <span className="ribbon">PREMIUM</span>}
                </a>
              ))}
            </div>
          </section>

          <Pagination strana={1} ukupno={12} osnova="/rubrika/sjenica" />
        </div>

        <Sidebar />
      </main>
    </>
  );
}

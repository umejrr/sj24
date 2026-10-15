import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HeroCarousel from '@/components/HeroCarousel';
import { NewsCard, SponsoredCard } from '@/components/NewsCard';
import Photo from '@/components/Photo';
import FirmaKartica from '@/components/FirmaKartica';
import { IconPower, IconRoad, IconBus, IconCandle } from '@/components/Icons';
import { getIstaknute, getNajnovije, getTeme, getOglasi, getFirme, getRubrike } from '@/lib/db';
import { KATEGORIJE_FIRMI } from '@/lib/konstante';
import { formatKratko } from '@/lib/format';

// Naslovna se osvežava najkasnije svakog minuta (CMS je osvežava odmah posle izmene).
export const revalidate = 60;

export default async function Home() {
  const [istaknute, rubrike, teme, { oglasi }, firme] = await Promise.all([
    getIstaknute(), getRubrike(), getTeme(), getOglasi({ poStrani: 4 }), getFirme(),
  ]);
  const naziv = (slug) => rubrike.find((r) => r.slug === slug)?.naziv ?? '';
  const slides = istaknute.map((v) => ({
    slug: v.slug,
    naslov: v.naslov,
    uvod: v.uvod ?? '',
    slika: v.slika_url ?? null,
    rubrikaNaziv: naziv(v.rubrika),
    vreme: formatKratko(v.datum),
  }));
  const najnovije = await getNajnovije(8, istaknute.map((v) => v.slug));

  return (
    <>
      <Header aktivno="vesti" />
      <main className="container page">
        <div className="page-main">
          {slides.length > 0 && <HeroCarousel slides={slides} />}

          <section className="section">
            <div className="section-head">
              <h2>Najnovije vesti</h2>
              {rubrike[0] && <Link href={`/rubrika/${rubrike[0].slug}`} className="more">Sve vesti</Link>}
            </div>
            {najnovije.length ? (
              <div className="news-grid">
                {najnovije.slice(0, 5).map((v) => <NewsCard key={v.slug} vest={v} />)}
                <SponsoredCard />
                {najnovije.slice(5).map((v) => <NewsCard key={v.slug} vest={v} />)}
              </div>
            ) : (
              <div className="empty">Još nema objavljenih vesti.</div>
            )}
          </section>

          {teme.length > 0 && (
            <section className="section">
              <div className="section-head">
                <h2>Aktuelno</h2>
                <span className="sub">Teme o kojima se priča danima</span>
              </div>
              <div className="topics no-scrollbar">
                {teme.map((t) => (
                  <Link key={t.slug} href={`/aktuelno#${t.slug}`} className="topic">
                    <span className="t">{t.naslov}</span>
                    <span className="f">Prati temu</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="section">
            <div className="section-head"><h2>Servis</h2></div>
            <div className="tiles">
              <Link href="/servis#struja_voda" className="tile"><IconPower /><span className="t">Struja i voda</span><span className="s">Najave isključenja</span></Link>
              <Link href="/servis#putevi" className="tile"><IconRoad /><span className="t">Stanje na putevima</span><span className="s">Pešter i okolina</span></Link>
              <Link href="/servis#red_voznje" className="tile"><IconBus /><span className="t">Red vožnje</span><span className="s">Autobuske linije</span></Link>
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
              <div className="empty">Još nema oglasa. <Link href="/oglasi#predaj">Predaj prvi, besplatno.</Link></div>
            )}
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Imenik firmi</h2>
              <div className="chips no-scrollbar">
                <Link href="/firme" className="chip active">Sve</Link>
                {KATEGORIJE_FIRMI.slice(0, 5).map((k) => (
                  <Link key={k} href={`/firme?kategorija=${encodeURIComponent(k)}`} className="chip">{k}</Link>
                ))}
              </div>
            </div>
            {firme.length ? (
              <div className="firms">
                {firme.slice(0, 6).map((f) => <FirmaKartica key={f.slug} f={f} />)}
              </div>
            ) : (
              <div className="empty">Imenik firmi uskoro. <Link href="/oglasavanje">Prijavite svoju firmu.</Link></div>
            )}
          </section>
        </div>

        <Sidebar />
      </main>
    </>
  );
}

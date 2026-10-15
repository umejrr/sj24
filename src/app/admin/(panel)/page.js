import Link from 'next/link';
import { serverKlijent } from '@/lib/supabase/server';
import { produziFirmu } from '@/app/admin/actions';
import { danasISO, dodajDane, formatDan } from '@/lib/format';

export const metadata = { title: 'Pregled' };

export default async function Pregled() {
  const sb = await serverKlijent();
  const danas = danasISO();
  const brojac = (tabela, f) => {
    let q = sb.from(tabela).select('*', { count: 'exact', head: true });
    if (f) q = f(q);
    return q.then((r) => r.count ?? 0);
  };

  const [objavljene, nacrti, oglasiCekaju, komentariCekaju, aktivneFirme, isticu, reklame, citane] = await Promise.all([
    brojac('vesti', (q) => q.eq('status', 'objavljeno')),
    brojac('vesti', (q) => q.eq('status', 'nacrt')),
    brojac('oglasi', (q) => q.eq('status', 'na_cekanju')),
    brojac('komentari', (q) => q.eq('status', 'na_cekanju')),
    brojac('firme', (q) => q.eq('aktivna', true).or(`placeno_do.is.null,placeno_do.gte.${danas}`)),
    sb.from('firme').select('id,naziv,placeno_do').lte('placeno_do', dodajDane(danas, 7)).eq('aktivna', true).order('placeno_do').limit(10),
    sb.from('reklame').select('id,naziv,prikazi,klikovi,aktivna').order('klikovi', { ascending: false }).limit(5),
    sb.from('vesti').select('id,naslov,pregledi').eq('status', 'objavljeno').order('pregledi', { ascending: false }).limit(5),
  ]);

  return (
    <div className="cpage">
      <header className="cpage-head">
        <div>
          <h1>Pregled</h1>
          <p>Šta se dešava na portalu i šta čeka tebe.</p>
        </div>
        <div className="cpage-actions">
          <Link href="/admin/vesti/novo" className="cbtn primary">+ Nova vest</Link>
          <Link href="/admin/servis/novo" className="cbtn ghost">+ Obaveštenje</Link>
        </div>
      </header>

      <div className="cstats">
        <Link href="/admin/vesti?f=objavljeno" className="cstat"><span className="n">{objavljene}</span><span>objavljenih vesti</span></Link>
        <Link href="/admin/vesti?f=nacrt" className="cstat"><span className="n">{nacrti}</span><span>nacrta</span></Link>
        <Link href="/admin/oglasi?f=na_cekanju" className={`cstat${oglasiCekaju ? ' alert' : ''}`}><span className="n">{oglasiCekaju}</span><span>oglasa čeka odobrenje</span></Link>
        <Link href="/admin/komentari?f=na_cekanju" className={`cstat${komentariCekaju ? ' alert' : ''}`}><span className="n">{komentariCekaju}</span><span>komentara čeka odobrenje</span></Link>
        <Link href="/admin/firme" className="cstat"><span className="n">{aktivneFirme}</span><span>firmi vidljivo na sajtu</span></Link>
      </div>

      <div className="cpanels">
        <section className="cpanel">
          <h2>Pretplate firmi: ističu ili su istekle</h2>
          {isticu.data?.length ? (
            <ul className="clist">
              {isticu.data.map((f) => (
                <li key={f.id}>
                  <Link href={`/admin/firme/${f.id}`}>{f.naziv}</Link>
                  <span className={`cstatus ${f.placeno_do < danas ? 's-odbijen' : 's-na_cekanju'}`}>
                    {f.placeno_do < danas ? 'isteklo' : 'ističe'} {formatDan(f.placeno_do)}
                  </span>
                  <form action={produziFirmu.bind(null, f.id, 30)}><button className="cbtn ok sm">Platio: +30 dana</button></form>
                </li>
              ))}
            </ul>
          ) : <p className="chint">Nijedna pretplata ne ističe u narednih 7 dana.</p>}
        </section>

        <section className="cpanel">
          <h2>Reklame sa najviše klikova</h2>
          {reklame.data?.length ? (
            <table className="ctable compact">
              <thead><tr><th>Reklama</th><th>Prikazi</th><th>Klikovi</th></tr></thead>
              <tbody>
                {reklame.data.map((r) => (
                  <tr key={r.id}>
                    <td className="main"><Link href={`/admin/reklame/${r.id}`}>{r.naziv}</Link>{!r.aktivna && <span className="cno"> (neaktivna)</span>}</td>
                    <td>{r.prikazi.toLocaleString('sr-RS')}</td>
                    <td>{r.klikovi.toLocaleString('sr-RS')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="chint">Još nema reklama. <Link href="/admin/reklame/novo">Dodaj prvu.</Link></p>}
        </section>

        <section className="cpanel">
          <h2>Najčitanije vesti</h2>
          {citane.data?.length ? (
            <ol className="clist numbered">
              {citane.data.map((v) => (
                <li key={v.id}>
                  <Link href={`/admin/vesti/${v.id}`}>{v.naslov}</Link>
                  <span className="chint">{v.pregledi.toLocaleString('sr-RS')} pregleda</span>
                </li>
              ))}
            </ol>
          ) : <p className="chint">Još nema objavljenih vesti. <Link href="/admin/vesti/novo">Napiši prvu.</Link></p>}
        </section>
      </div>
    </div>
  );
}

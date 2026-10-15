import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SEKCIJE } from '@/lib/cms';
import { labela } from '@/lib/konstante';
import { formatKratko, formatDan, danasISO, dodajDane } from '@/lib/format';
import { serverKlijent } from '@/lib/supabase/server';
import { postaviStatus, produziFirmu } from '@/app/admin/actions';

const PO_STRANI = 30;

const PORUKE = {
  sacuvano: ['ok', 'Sačuvano. Sajt je osvežen.'],
  obrisano: ['ok', 'Obrisano.'],
  greska: ['err', 'Radnja nije uspela. Pokušaj ponovo.'],
};

export async function generateMetadata({ params }) {
  const { sekcija } = await params;
  return { title: SEKCIJE[sekcija]?.naslov ?? 'CMS' };
}

export default async function Lista({ params, searchParams }) {
  const { sekcija } = await params;
  const cfg = SEKCIJE[sekcija];
  if (!cfg) notFound();
  const sp = await searchParams;
  const kljuc = cfg.kljuc ?? 'id';
  const q = String(sp?.q ?? '').trim();
  const strana = Math.max(1, Number(sp?.strana) || 1);
  const filter = cfg.filter ? (sp?.f === undefined ? (cfg.filter.podrazumevano ?? '') : sp.f) : '';

  const sb = await serverKlijent();
  let upit = sb.from(cfg.tabela).select(cfg.select ?? '*', { count: 'exact' });
  if (q && cfg.pretraga) upit = upit.ilike(cfg.pretraga, `%${q}%`);
  if (filter) upit = upit.eq(cfg.filter.polje, filter);
  upit = upit.order(cfg.red[0], { ascending: cfg.red[1] }).range((strana - 1) * PO_STRANI, strana * PO_STRANI - 1);
  const { data: redovi, count, error } = await upit;
  const brojStrana = Math.max(1, Math.ceil((count ?? 0) / PO_STRANI));
  const poruka = PORUKE[sp?.poruka];

  const url = (izmene) => {
    const p = new URLSearchParams();
    const sve = { q, f: cfg.filter ? filter : undefined, strana: undefined, ...izmene };
    Object.entries(sve).forEach(([k, v]) => { if (v !== undefined && !(k === 'q' && !v)) p.set(k, v); });
    const s = p.toString();
    return `/admin/${sekcija}${s ? `?${s}` : ''}`;
  };

  return (
    <div className="cpage">
      <header className="cpage-head">
        <div>
          <h1>{cfg.naslov}</h1>
          {cfg.opis && <p>{cfg.opis}</p>}
        </div>
        {!cfg.bezNovog && <Link href={`/admin/${sekcija}/novo`} className="cbtn primary">+ {cfg.novo}</Link>}
      </header>

      {poruka && <div className={`cnotice ${poruka[0]}`} role="status">{poruka[1]}</div>}
      {error && <div className="cnotice err">Greška pri čitanju: {error.message}</div>}

      <div className="ctoolbar">
        {cfg.filter && (
          <div className="cchips">
            <Link href={url({ f: '' })} className={!filter ? 'on' : undefined}>Sve</Link>
            {cfg.filter.opcije.map(([v, l]) => (
              <Link key={v} href={url({ f: v })} className={filter === v ? 'on' : undefined}>{l}</Link>
            ))}
          </div>
        )}
        {cfg.pretraga && (
          <form className="csearch" action={`/admin/${sekcija}`}>
            {cfg.filter && <input type="hidden" name="f" value={filter} />}
            <input name="q" defaultValue={q} placeholder="Pretraži…" aria-label="Pretraga" />
            <button className="cbtn ghost">Traži</button>
          </form>
        )}
      </div>

      {redovi?.length ? (
        <div className="ctable-wrap">
          <table className="ctable">
            <thead>
              <tr>
                {cfg.kolone.map((k) => <th key={k.polje} className={k.tip === 'slika' ? 'thumb' : undefined}>{k.naslov ?? ''}</th>)}
                <th className="actions"><span className="sr-only">Radnje</span></th>
              </tr>
            </thead>
            <tbody>
              {redovi.map((r) => {
                const id = String(r[kljuc]);
                const urediHref = `/admin/${sekcija}/${encodeURIComponent(id)}`;
                const javni = cfg.javniLink?.(r);
                return (
                  <tr key={id}>
                    {cfg.kolone.map((k) => (
                      <td key={k.polje} className={k.tip === 'slika' ? 'thumb' : k.glavna ? 'main' : undefined} data-label={k.naslov}>
                        {k.glavna ? <Link href={urediHref}>{prikazi(k, r) || '(bez naslova)'}</Link> : prikazi(k, r)}
                      </td>
                    ))}
                    <td className="actions">
                      {cfg.moderacija && r.status !== 'odobren' && (
                        <form action={postaviStatus.bind(null, sekcija, id, 'odobren')}><button className="cbtn ok sm">Odobri</button></form>
                      )}
                      {cfg.moderacija && r.status === 'na_cekanju' && (
                        <form action={postaviStatus.bind(null, sekcija, id, 'odbijen')}><button className="cbtn ghost sm">Odbij</button></form>
                      )}
                      {cfg.produzenje && (
                        <form action={produziFirmu.bind(null, id, 30)}><button className="cbtn ghost sm" title="Firma je platila: produži za 30 dana">+30 dana</button></form>
                      )}
                      {javni && <a href={javni} target="_blank" rel="noopener" className="cbtn ghost sm">Vidi</a>}
                      <Link href={urediHref} className="cbtn ghost sm">Uredi</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="cempty">
            {q || filter ? 'Nema rezultata za ovaj filter.' : 'Ovde još nema ničega.'}
            {!cfg.bezNovog && !q && <> <Link href={`/admin/${sekcija}/novo`}>{cfg.novo}</Link></>}
          </div>
        )
      )}

      {brojStrana > 1 && (
        <nav className="cpager" aria-label="Stranice">
          {strana > 1 && <Link href={url({ strana: strana - 1 })} className="cbtn ghost sm">‹ Prethodna</Link>}
          <span>Strana {strana} od {brojStrana} · ukupno {count}</span>
          {strana < brojStrana && <Link href={url({ strana: strana + 1 })} className="cbtn ghost sm">Sledeća ›</Link>}
        </nav>
      )}
    </div>
  );
}

function prikazi(k, r) {
  if (k.prikaz) return k.prikaz(r);
  const v = r[k.polje];
  switch (k.tip) {
    case 'slika':
      return v ? <img src={v} alt="" /> : <span className="cthumb-empty" />;
    case 'status':
      return <span className={`cstatus s-${v}`}>{labela(k.opcije, v)}</span>;
    case 'opcija':
      return labela(k.opcije, v);
    case 'bool':
      return v ? <span className="cyes">Da</span> : <span className="cno">Ne</span>;
    case 'broj':
      return Number(v ?? 0).toLocaleString('sr-RS');
    case 'datumVreme':
      return formatKratko(v);
    case 'dan':
      return formatDan(v);
    case 'placeno': {
      if (!v) return <span className="cno">bez roka</span>;
      const danas = danasISO();
      if (v < danas) return <span className="cstatus s-odbijen">Isteklo {formatDan(v)}</span>;
      if (v <= dodajDane(danas, 7)) return <span className="cstatus s-na_cekanju">Ističe {formatDan(v)}</span>;
      return formatDan(v);
    }
    default:
      return v ?? '';
  }
}

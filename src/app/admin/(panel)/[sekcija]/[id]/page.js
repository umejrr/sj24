import Link from 'next/link';
import { notFound } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import PotvrdiDugme from '@/components/admin/PotvrdiDugme';
import { SEKCIJE } from '@/lib/cms';
import { serverKlijent } from '@/lib/supabase/server';
import { sacuvaj, obrisi } from '@/app/admin/actions';

export async function generateMetadata({ params }) {
  const { sekcija, id } = await params;
  const cfg = SEKCIJE[sekcija];
  return { title: id === 'novo' ? cfg?.novo : `Izmena · ${cfg?.naslov ?? ''}` };
}

export default async function Uredi({ params }) {
  const { sekcija, id: sirovId } = await params;
  const cfg = SEKCIJE[sekcija];
  if (!cfg) notFound();
  const id = decodeURIComponent(sirovId);
  const novo = id === 'novo';
  if (novo && cfg.bezNovog) notFound();

  const sb = await serverKlijent();
  let pocetno = {};
  if (novo) {
    for (const p of cfg.polja) {
      if (p.podrazumevano !== undefined) pocetno[p.ime] = p.podrazumevano;
      if (p.tip === 'datetime') pocetno[p.ime] = new Date().toISOString();
    }
  } else {
    const { data } = await sb.from(cfg.tabela).select('*').eq(cfg.kljuc ?? 'id', id).maybeSingle();
    if (!data) notFound();
    pocetno = data;
  }

  // Opcije za padajuće liste koje dolaze iz drugih tabela (rubrike, teme, firme)
  const opcijeIz = {};
  await Promise.all(cfg.polja.filter((p) => p.iz).map(async (p) => {
    const { data } = await sb.from(p.iz.tabela).select(`${p.iz.vrednost},${p.iz.labela}`).order(p.iz.red ?? p.iz.labela);
    opcijeIz[p.ime] = (data ?? []).map((r) => [String(r[p.iz.vrednost]), r[p.iz.labela]]);
  }));

  const javni = !novo && cfg.javniLink?.(pocetno);

  return (
    <div className="cpage narrow">
      <header className="cpage-head">
        <div>
          <Link href={`/admin/${sekcija}`} className="cback">← {cfg.naslov}</Link>
          <h1>{novo ? cfg.novo : (pocetno.naslov || pocetno.naziv || pocetno.ime || 'Izmena')}</h1>
        </div>
        <div className="cpage-actions">
          {javni && <a href={javni} target="_blank" rel="noopener" className="cbtn ghost">Vidi na sajtu ↗</a>}
          {!novo && (
            <PotvrdiDugme akcija={obrisi.bind(null, sekcija, id)} poruka="Sigurno obrisati? Ovo ne može da se vrati.">
              Obriši
            </PotvrdiDugme>
          )}
        </div>
      </header>

      <EntityForm sekcija={sekcija} pocetno={pocetno} opcijeIz={opcijeIz} akcija={sacuvaj.bind(null, sekcija, id)} />
    </div>
  );
}

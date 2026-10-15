import PodesavanjaForma from '@/components/admin/PodesavanjaForma';
import { serverKlijent } from '@/lib/supabase/server';

export const metadata = { title: 'Podešavanja' };

export default async function Podesavanja() {
  const sb = await serverKlijent();
  const { data } = await sb.from('podesavanja').select('kljuc,vrednost');
  const vrednosti = Object.fromEntries((data ?? []).map((r) => [r.kljuc, r.vrednost ?? '']));
  return (
    <div className="cpage narrow">
      <header className="cpage-head">
        <div>
          <h1>Podešavanja</h1>
          <p>Opšti tekstovi i kontakti koji se vide na celom sajtu.</p>
        </div>
      </header>
      <PodesavanjaForma vrednosti={vrednosti} />
    </div>
  );
}

'use client';

import { useActionState, useState } from 'react';
import { predajOglas } from '@/app/(sajt)/oglasi/actions';
import { otpremiSliku } from '@/lib/supabase/browser';
import { KATEGORIJE_OGLASA } from '@/lib/konstante';

export default function OglasForma() {
  const [stanje, posalji, salje] = useActionState(predajOglas, {});
  const [slika, setSlika] = useState('');
  const [status, setStatus] = useState('');
  const v = stanje?.vrednosti ?? {};

  async function izaberiSliku(e) {
    const fajl = e.target.files?.[0];
    if (!fajl) return;
    setStatus('Otpremam sliku…');
    try {
      setSlika(await otpremiSliku(fajl, 'oglasi'));
      setStatus('');
    } catch (err) {
      setStatus(err.message);
    }
  }

  if (stanje?.ok) {
    return (
      <div className="notice ok" role="status">
        Hvala! Oglas je poslat i pojaviće se na sajtu čim ga redakcija odobri. Oglas traje 30 dana.
      </div>
    );
  }

  return (
    <form action={posalji} className="form">
      {stanje?.greska && <div className="notice err" role="alert">{stanje.greska}</div>}
      <div className="form-grid">
        <label>Kategorija
          <select name="kategorija" defaultValue={v.kategorija ?? ''} required>
            <option value="" disabled>Izaberi…</option>
            {KATEGORIJE_OGLASA.map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
        <label>Cena <input name="cena" defaultValue={v.cena} placeholder="npr. 5.000 € ili Po dogovoru" /></label>
        <label className="full">Naslov oglasa <input name="naslov" defaultValue={v.naslov} required minLength={5} maxLength={120} /></label>
        <label className="full">Opis <textarea name="opis" rows={5} defaultValue={v.opis} maxLength={3000} /></label>
        <label>Mesto <input name="mesto" defaultValue={v.mesto ?? 'Sjenica'} /></label>
        <label>Ime <input name="ime" defaultValue={v.ime} /></label>
        <label>Telefon <input name="telefon" type="tel" defaultValue={v.telefon} /></label>
        <label>Email <input name="email" type="email" defaultValue={v.email} /></label>
        <label className="full">Slika (nije obavezno)
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={izaberiSliku} />
          {status && <span className="hint">{status}</span>}
          {slika && <img className="upload-preview" src={slika} alt="Izabrana slika" />}
        </label>
        <input type="hidden" name="slika_url" value={slika} />
        <label className="hp" aria-hidden="true">Web <input name="web" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button className="btn btn-accent" disabled={salje}>{salje ? 'Šaljem…' : 'Pošalji oglas'}</button>
      <p className="hint">Oglasi su besplatni. Objavljuju se posle odobrenja i ističu za 30 dana.</p>
    </form>
  );
}

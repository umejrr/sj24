'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { SEKCIJE } from '@/lib/cms';
import { isoULokalno } from '@/lib/format';
import { SlikaPolje, GalerijaPolje } from './SlikaPolja';

// Forma za unos/izmenu bilo koje sekcije (polja dolaze iz src/lib/cms.js).
export default function EntityForm({ sekcija, pocetno, opcijeIz, akcija }) {
  const cfg = SEKCIJE[sekcija];
  const [greska, setGreska] = useState('');
  const [salje, startTransition] = useTransition();

  function posalji(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setGreska('');
    startTransition(async () => {
      const rez = await akcija(fd);
      if (rez?.greska) {
        setGreska(rez.greska);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  return (
    <form className="cform" onSubmit={posalji}>
      {greska && <div className="cnotice err" role="alert">{greska}</div>}
      <div className="cform-grid">
        {cfg.polja.map((p) => (
          <Polje key={p.ime} p={p} vrednost={pocetno[p.ime]} opcije={opcijeIz[p.ime]} />
        ))}
      </div>
      <div className="cform-bar">
        <button className="cbtn primary" disabled={salje}>{salje ? 'Čuvam…' : 'Sačuvaj'}</button>
        <Link href={`/admin/${sekcija}`} className="cbtn ghost">Otkaži</Link>
      </div>
    </form>
  );
}

function Polje({ p, vrednost, opcije }) {
  const id = `f-${p.ime}`;
  const klasa = `cfield${p.pola ? ' half' : ''}${p.tip === 'checkbox' ? ' check' : ''}`;
  const pomoc = p.pomoc && <span className="chint">{p.pomoc}</span>;

  if (p.tip === 'checkbox') {
    return (
      <div className={klasa}>
        <label htmlFor={id}>
          <input id={id} type="checkbox" name={p.ime} defaultChecked={Boolean(vrednost)} />
          <span>{p.naslov}</span>
        </label>
        {pomoc}
      </div>
    );
  }

  let kontrola;
  switch (p.tip) {
    case 'textarea':
      kontrola = <textarea id={id} name={p.ime} rows={p.redova ?? 4} defaultValue={vrednost ?? ''} required={p.obavezno} />;
      break;
    case 'select': {
      const lista = opcije ?? p.opcije ?? [];
      kontrola = (
        <select id={id} name={p.ime} defaultValue={vrednost ?? ''} required={p.obavezno}>
          {(p.prazno || !vrednost) && <option value="">{p.prazno ?? 'Izaberi…'}</option>}
          {lista.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      );
      break;
    }
    case 'number':
      kontrola = <input id={id} type="number" name={p.ime} defaultValue={vrednost ?? ''} />;
      break;
    case 'date':
      kontrola = <input id={id} type="date" name={p.ime} defaultValue={vrednost ? String(vrednost).slice(0, 10) : ''} />;
      break;
    case 'datetime':
      kontrola = <input id={id} type="datetime-local" name={p.ime} defaultValue={isoULokalno(vrednost)} />;
      break;
    case 'slug':
      kontrola = (
        <div className="cslug">
          {p.prefiks && <span>{p.prefiks}</span>}
          <input id={id} name={p.ime} defaultValue={vrednost ?? ''} placeholder="automatski" autoCapitalize="off" spellCheck={false} />
          {p.sufiks && <span>{p.sufiks}</span>}
        </div>
      );
      break;
    case 'slika':
      kontrola = <SlikaPolje ime={p.ime} pocetno={vrednost} folder={p.folder} />;
      break;
    case 'galerija':
      kontrola = <GalerijaPolje ime={p.ime} pocetno={vrednost} folder={p.folder} />;
      break;
    case 'url':
      kontrola = <input id={id} type="text" inputMode="url" name={p.ime} defaultValue={vrednost ?? ''} placeholder="https://" autoCapitalize="off" spellCheck={false} />;
      break;
    default:
      kontrola = <input id={id} type={p.tip === 'text' ? 'text' : p.tip} name={p.ime} defaultValue={vrednost ?? ''} required={p.obavezno} maxLength={p.max} />;
  }

  return (
    <div className={klasa}>
      <label htmlFor={id}>{p.naslov}{p.obavezno && <span className="req"> *</span>}</label>
      {kontrola}
      {pomoc}
    </div>
  );
}

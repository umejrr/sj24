'use client';

import { useState, useTransition } from 'react';
import { PODESAVANJA } from '@/lib/cms';
import { sacuvajPodesavanja } from '@/app/admin/actions';

export default function PodesavanjaForma({ vrednosti }) {
  const [poruka, setPoruka] = useState(null);
  const [salje, startTransition] = useTransition();

  function posalji(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await sacuvajPodesavanja(fd);
      setPoruka(r?.greska ? ['err', r.greska] : ['ok', r?.ok ?? 'Sačuvano.']);
    });
  }

  return (
    <form className="cform" onSubmit={posalji}>
      {poruka && <div className={`cnotice ${poruka[0]}`} role="status">{poruka[1]}</div>}
      <div className="cform-grid">
        {PODESAVANJA.map((p) => (
          <div key={p.ime} className="cfield">
            <label htmlFor={`s-${p.ime}`}>{p.naslov}</label>
            {p.tip === 'textarea'
              ? <textarea id={`s-${p.ime}`} name={p.ime} rows={p.redova ?? 3} defaultValue={vrednosti[p.ime] ?? ''} />
              : <input id={`s-${p.ime}`} name={p.ime} type={p.tip === 'url' ? 'text' : p.tip} inputMode={p.tip === 'url' ? 'url' : undefined} defaultValue={vrednosti[p.ime] ?? ''} />}
            {p.pomoc && <span className="chint">{p.pomoc}</span>}
          </div>
        ))}
      </div>
      <div className="cform-bar">
        <button className="cbtn primary" disabled={salje}>{salje ? 'Čuvam…' : 'Sačuvaj podešavanja'}</button>
      </div>
    </form>
  );
}

'use client';

import { useRef, useState } from 'react';
import { otpremiSliku } from '@/lib/supabase/browser';

// Jedna slika: otpremi sa računara/telefona ili nalepi link.
export function SlikaPolje({ ime, pocetno, folder }) {
  const [url, setUrl] = useState(pocetno ?? '');
  const [status, setStatus] = useState('');
  const fajlRef = useRef(null);

  async function izaberi(e) {
    const fajl = e.target.files?.[0];
    if (!fajl) return;
    setStatus('Otpremam…');
    try {
      setUrl(await otpremiSliku(fajl, folder));
      setStatus('');
    } catch (err) {
      setStatus(err.message);
    } finally {
      if (fajlRef.current) fajlRef.current.value = '';
    }
  }

  return (
    <div className="img-field">
      <div className="img-preview">
        {url ? <img src={url} alt="" /> : <span>Nema slike</span>}
      </div>
      <div className="img-controls">
        <label className="cbtn">
          {url ? 'Zameni sliku' : 'Otpremi sliku'}
          <input ref={fajlRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={izaberi} hidden />
        </label>
        {url && <button type="button" className="cbtn ghost" onClick={() => setUrl('')}>Ukloni</button>}
        <input type="text" inputMode="url" name={ime} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="ili nalepi link slike" />
        {status && <span className={`chint${status.endsWith('…') ? '' : ' err'}`}>{status}</span>}
      </div>
    </div>
  );
}

// Više slika (galerija firme)
export function GalerijaPolje({ ime, pocetno, folder }) {
  const [slike, setSlike] = useState(Array.isArray(pocetno) ? pocetno : []);
  const [status, setStatus] = useState('');

  async function dodaj(e) {
    const fajlovi = [...(e.target.files ?? [])];
    e.target.value = '';
    for (let i = 0; i < fajlovi.length; i++) {
      setStatus(`Otpremam ${i + 1} od ${fajlovi.length}…`);
      try {
        const url = await otpremiSliku(fajlovi[i], folder);
        setSlike((s) => [...s, url]);
      } catch (err) {
        setStatus(err.message);
        return;
      }
    }
    setStatus('');
  }

  const pomeri = (i, smer) => setSlike((s) => {
    const n = [...s];
    const j = i + smer;
    if (j < 0 || j >= n.length) return s;
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  });

  return (
    <div className="gallery-field">
      <input type="hidden" name={ime} value={JSON.stringify(slike)} />
      <div className="gallery-grid">
        {slike.map((src, i) => (
          <div key={src} className="gallery-item">
            <img src={src} alt="" />
            <div className="gallery-actions">
              <button type="button" aria-label="Pomeri levo" onClick={() => pomeri(i, -1)}>‹</button>
              <button type="button" aria-label="Ukloni sliku" onClick={() => setSlike((s) => s.filter((x) => x !== src))}>×</button>
              <button type="button" aria-label="Pomeri desno" onClick={() => pomeri(i, 1)}>›</button>
            </div>
          </div>
        ))}
        <label className="gallery-add">
          + Dodaj slike
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={dodaj} hidden />
        </label>
      </div>
      {status && <span className={`chint${status.endsWith('…') ? '' : ' err'}`}>{status}</span>}
    </div>
  );
}

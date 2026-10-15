'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconPrev, IconNext } from './Icons';

// Glavni karusel: menja vest na 7 sekundi, staje kad je miš iznad njega.
export default function HeroCarousel({ slides }) {
  const [i, setI] = useState(0);
  const [pauza, setPauza] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (pauza || n < 2) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [pauza, n]);

  if (!n) return null;
  const s = slides[i];

  return (
    <section
      className="hero"
      aria-roledescription="karusel"
      aria-label="Glavne vesti"
      onMouseEnter={() => setPauza(true)}
      onMouseLeave={() => setPauza(false)}
    >
      <div className="hero-stage">
        {s.slika ? (
          <img className="hero-bg hero-img" src={s.slika} alt="" />
        ) : (
          <svg className="hero-bg" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="900" height="500" style={{ fill: 'var(--sky)' }} />
            <circle cx="690" cy="120" r="70" style={{ fill: 'var(--accent)' }} />
            <path d="M0 290 C150 240 300 262 450 230 C600 198 750 240 900 210 L900 500 L0 500 Z" style={{ fill: 'var(--hill-1)' }} />
            <path d="M0 350 C180 310 350 338 520 305 C680 276 800 300 900 290 L900 500 L0 500 Z" style={{ fill: 'var(--hill-2)' }} />
            <path d="M0 410 C220 385 420 402 620 378 C760 362 840 370 900 365 L900 500 L0 500 Z" style={{ fill: 'var(--hill-3)' }} />
          </svg>
        )}

        <Link href={`/vesti/${s.slug}`} className="hero-panel" aria-live="polite">
          {s.rubrikaNaziv && <span className="badge">{s.rubrikaNaziv}</span>}
          <h1>{s.naslov}</h1>
          <p>{s.uvod}</p>
          <span className="meta">{s.vreme}</span>
        </Link>

        <div className="hero-controls">
          <button className="hero-prev" aria-label="Prethodna vest" onClick={() => setI((x) => (x - 1 + n) % n)}><IconPrev /></button>
          <button className="hero-next" aria-label="Sledeća vest" onClick={() => setI((x) => (x + 1) % n)}><IconNext /></button>
        </div>
      </div>

      <div className="hero-tabs" role="tablist" aria-label="Izbor glavne vesti">
        {slides.map((x, k) => (
          <button
            key={x.slug}
            role="tab"
            aria-selected={k === i}
            className="hero-tab"
            onClick={() => setI(k)}
          >
            <span className="kicker">{x.rubrikaNaziv}</span>
            <span className="t">{x.naslov}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';

// Numerisane stranice: ‹ 1 2 3 … 12 ›
export default function Pagination({ strana, ukupno, osnova }) {
  if (ukupno < 2) return null;
  const href = (p) => (p === 1 ? osnova : `${osnova}?strana=${p}`);

  const brojevi = [];
  for (let p = 1; p <= ukupno; p++) {
    if (p === 1 || p === ukupno || Math.abs(p - strana) <= 1) brojevi.push(p);
    else if (brojevi[brojevi.length - 1] !== '…') brojevi.push('…');
  }

  return (
    <nav className="pagination" aria-label="Stranice">
      {strana > 1
        ? <Link href={href(strana - 1)} aria-label="Prethodna stranica">‹</Link>
        : <span className="disabled" aria-hidden="true">‹</span>}
      {brojevi.map((p, k) => (p === '…'
        ? <span key={`g${k}`} className="gap">…</span>
        : <Link key={p} href={href(p)} aria-current={p === strana ? 'page' : undefined}>{p}</Link>))}
      {strana < ukupno
        ? <Link href={href(strana + 1)} aria-label="Sledeća stranica">›</Link>
        : <span className="disabled" aria-hidden="true">›</span>}
    </nav>
  );
}

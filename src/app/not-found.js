import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container page">
      <div className="page-main">
        <Link href="/" className="logo logo-sm" aria-label="SJ24 početna">
          <span className="logo-mark"><span className="sj">SJ</span><span className="n24">24</span></span>
        </Link>
        <section className="section">
          <div className="section-head"><h2>Stranica nije pronađena</h2></div>
          <div className="empty">Tražena stranica ne postoji ili je uklonjena. <Link href="/">Nazad na naslovnu</Link></div>
        </section>
      </div>
    </main>
  );
}

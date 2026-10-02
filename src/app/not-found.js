import Link from 'next/link';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <>
      <Header aktivno="" />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head"><h2>Stranica nije pronađena</h2></div>
            <div className="empty">Tražena stranica ne postoji ili je uklonjena. <Link href="/">Nazad na naslovnu</Link></div>
          </section>
        </div>
      </main>
    </>
  );
}

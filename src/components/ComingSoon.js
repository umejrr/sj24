import Header from './Header';
import Sidebar from './Sidebar';

// Privremena stranica za delove portala koji dolaze u sledećim fazama.
export default function ComingSoon({ aktivno, naslov, opis }) {
  return (
    <>
      <Header aktivno={aktivno} />
      <main className="container page">
        <div className="page-main">
          <section className="section">
            <div className="section-head"><h2>{naslov}</h2></div>
            <div className="empty">{opis}</div>
          </section>
        </div>
        <Sidebar />
      </main>
    </>
  );
}

import Footer from '@/components/Footer';

// Izgled javnog sajta (CMS u /admin ima svoj).
export default function SajtLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

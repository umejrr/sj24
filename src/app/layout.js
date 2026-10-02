import { Sora, Public_Sans } from 'next/font/google';
import Footer from '@/components/Footer';
import './globals.css';

const sora = Sora({ subsets: ['latin', 'latin-ext'], weight: ['600', '700', '800'], variable: '--font-sora', display: 'swap' });
const publicSans = Public_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-public-sans', display: 'swap' });

export const metadata = {
  title: { default: 'SJ24 · Vesti iz Sjenice i Peštera', template: '%s · SJ24' },
  description: 'Lokalni portal Sjenice i Peštera: vesti, aktuelno, mali oglasi i imenik firmi.',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#111214' };

export default function RootLayout({ children }) {
  return (
    <html lang="sr-Latn" className={`${sora.variable} ${publicSans.variable}`}>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}

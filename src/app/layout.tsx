/**
 * Корневой layout приложения.
 * Подключает шрифты Playfair Display (serif) и Inter (sans), Header и Footer.
 */

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/Header';
import './globals.css';

/** Serif-шрифт для заголовков и цен — эстетика премиального бренда */
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
});

/** Sans-serif для интерфейсного текста */
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chocolat. — Премиальная кондитерская',
  description:
    'Изысканные кондитерские изделия ручной работы. Авторские торты, macarons и шоколад высшего качества.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>

        {/* Минималистичный footer */}
        <footer className="border-t border-chocolate/10 bg-cream py-16">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <p className="font-serif text-2xl font-light text-chocolate">
              Chocolat<span className="text-gold">.</span>
            </p>
            <div className="divider-gold mx-auto my-6 max-w-xs" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-chocolate/40">
              © {new Date().getFullYear()} — Искусство сладкого
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

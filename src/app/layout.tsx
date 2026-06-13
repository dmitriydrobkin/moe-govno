import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/Header';
import { getSiteSettings } from '@/server/functions/settings';
import { CartSlideOver } from '@/components/CartSlideOver'; 
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.site_title ?? 'Chocolat. — Премиальная кондитерская';
  const description = settings.site_description ?? 'Изысканные кондитерские изделия ручной работы.';
  const isIndexingEnabled = settings.seo_indexing_enabled === 'true';

  return {
    title,
    description,
    robots: {
      index: isIndexingEnabled,
      follow: isIndexingEnabled,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const brandName = settings.brand_name ?? 'Chocolat';
  const footerText = settings.footer_text ?? 'Искусство сладкого';

  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Header />
        <CartSlideOver /> 
        
        <main>{children}</main>

        <footer className="border-t border-chocolate/10 bg-cream py-16">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <p className="font-serif text-2xl font-light text-chocolate">
              {brandName}<span className="text-gold">.</span>
            </p>
            <div className="divider-gold mx-auto my-6 max-w-xs" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-chocolate/40">
              © {new Date().getFullYear()} — {footerText}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

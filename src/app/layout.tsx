/**
 * Корневой layout приложения.
 * Подключает шрифты Playfair Display (serif) и Inter (sans), Header и Footer.
 * Полностью динамический — мета-теги, SEO-индексация и тексты подтягиваются из D1.
 */

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/Header';
import { getSiteSettings } from '@/server/functions/settings'; // Наша функция чтения из D1
import './globals.css';

export const runtime = 'edge';
// ⚡ ФИНАЛЬНАЯ БРОНЯ ОТ ОШИБОК СБОРКИ: Запрещаем статическую генерацию (SSG)
// Весь сайт будет работать строго в динамическом Edge-режиме, так как мы используем базу D1
export const dynamic = 'force-dynamic';

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

/**
 * Динамическая генерация мета-данных Next.js.
 * Вызывается сервером Cloudflare автоматически при запросе к любой странице.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  // Дефолтные значения (Fallback), если записей в базе еще нет
  const title = settings.site_title ?? 'Chocolat. — Премиальная кондитерская';
  const description = settings.site_description ?? 'Изысканные кондитерские изделия ручной работы. Авторские торты, macarons и шоколад высшего качества.';
  
  // Жесткое правило безопасности: если флаг индексации не равен 'true',
  // принудительно отдаем роботам noindex, закрывая мусор от Google.
  const isIndexingEnabled = settings.seo_indexing_enabled === 'true';

  return {
    title,
    description,
    robots: {
      index: isIndexingEnabled,
      follow: isIndexingEnabled,
      nocache: !isIndexingEnabled,
      googleBot: {
        index: isIndexingEnabled,
        follow: isIndexingEnabled,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Загружаем настройки для отрисовки динамического подвала (Footer)
  const settings = await getSiteSettings();
  
  const brandName = settings.brand_name ?? 'Chocolat';
  const footerText = settings.footer_text ?? 'Искусство сладкого';

  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>

        {/* Минималистичный универсальный footer */}
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

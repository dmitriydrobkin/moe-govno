'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartSlideOver } from './CartSlideOver';

export function Header() {
  const pathname = usePathname();

  // ⚡️ Скрываем главное меню сайта внутри панели управления
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-chocolate/10 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="font-serif text-3xl text-chocolate">
          Chocolat.
        </Link>

        <nav className="hidden space-x-8 md:flex font-sans text-xs uppercase tracking-widest text-chocolate/80">
          <Link href="/catalog" className="transition-colors hover:text-gold">Каталог</Link>
          <Link href="/#about" className="transition-colors hover:text-gold">О нас</Link>
        </nav>

        <CartSlideOver />
      </div>
    </header>
  );
}
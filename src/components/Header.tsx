/**
 * Шапка сайта с навигацией и иконкой корзины.
 * Клиентский компонент — управляет открытием slide-over корзины.
 */

'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { CartSlideOver } from '@/components/CartSlideOver';

/** Навигационные ссылки премиального магазина */
const NAV_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
];

export function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-chocolate/5 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          {/* Логотип бренда */}
          <Link
            href="/"
            className="font-serif text-2xl font-light tracking-wide text-chocolate transition-colors duration-300 hover:text-gold md:text-3xl"
          >
            Chocolat<span className="text-gold">.</span>
          </Link>

          {/* Основная навигация */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-xs uppercase tracking-[0.2em] text-chocolate/70 transition-colors duration-300 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Корзина и мобильная навигация */}
          <div className="flex items-center gap-6">
            <Link
              href="/catalog"
              className="font-sans text-xs uppercase tracking-[0.2em] text-chocolate/70 transition-colors duration-300 hover:text-gold md:hidden"
            >
              Каталог
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="group relative flex items-center gap-2 transition-colors duration-300 hover:text-gold"
              aria-label="Открыть корзину"
            >
              {/* SVG-иконка корзины */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-6 w-6 text-chocolate transition-colors duration-300 group-hover:text-gold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              {/* Бейдж количества товаров */}
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold font-sans text-[10px] font-medium text-chocolate">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Выезжающая панель корзины */}
      <CartSlideOver />
    </>
  );
}

/**
 * Главная страница премиального кондитерского магазина.
 * Серверный компонент — данные из D1 через Drizzle (с fallback на mock).
 */

import Link from 'next/link';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { getCategories } from '@/server/functions/categories';
import { getBestsellers } from '@/server/functions/products';
import { getSiteSettings } from '@/server/functions/settings';
// ИМПОРТИРУЕМ ТИПЫ ДЛЯ СТРОГОЙ ТИПИЗАЦИИ
import type { Category, Product } from '@/server/db/schema';

export const runtime = 'edge';

// Стандартные тексты (Fallback), если в базе данных пусто
const DEFAULT_TEXTS = {
  hero_badge: 'Maison de Pâtisserie',
  hero_title_1: 'Искусство',
  hero_title_italic: 'сладкого',
  hero_description: 'Каждое изделие — маленький шедевр. Бельгийский шоколад, свежие ягоды и безупречное мастерство.',
};

export default async function HomePage() {
  // Загружаем категории, бестселлеры и настройки сайта параллельно
  const [categories, bestsellers, settings] = await Promise.all([
    getCategories(),
    getBestsellers(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Hero-баннер на весь экран */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* Фоновое изображение с overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-chocolate/70" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center animate-fade-in">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
            {settings.hero_badge ?? DEFAULT_TEXTS.hero_badge}
          </p>
          <h1 className="mt-6 font-serif text-5xl font-light leading-tight text-cream md:text-7xl lg:text-8xl">
            {settings.hero_title_1 ?? DEFAULT_TEXTS.hero_title_1}
            <br />
            <span className="italic text-gold">
              {settings.hero_title_italic ?? DEFAULT_TEXTS.hero_title_italic}
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-lg font-sans text-base font-light leading-relaxed text-cream/70">
            {settings.hero_description ?? DEFAULT_TEXTS.hero_description}
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/catalog" className="btn-primary">
              Открыть каталог
            </Link>
            <Link href="/catalog?category=torty" className="btn-outline border-cream/30 text-cream hover:border-gold hover:text-gold">
              Авторские торты
            </Link>
          </div>
        </div>

        {/* Декоративная золотая линия внизу hero */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </section>

      {/* Сетка категорий */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center">
          <h2 className="section-title">Коллекции</h2>
          <p className="section-subtitle mx-auto">
            Выберите направление — от воздушных macarons до монументальных тортов
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* ЯВНАЯ ТИПИЗАЦИЯ Category */}
          {categories.map((category: Category, index: number) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* Секция бестселлеров */}
      <section className="bg-cream-dark py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="section-title">Бестселлеры</h2>
              <p className="section-subtitle">
                Самые востребованные creations нашей patisserie
              </p>
            </div>
            <Link
              href="/catalog"
              className="btn-outline whitespace-nowrap"
            >
              Весь каталог
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* ЯВНАЯ ТИПИЗАЦИЯ Product */}
            {bestsellers.map((product: Product, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Философия бренда */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
              Наша философия
            </p>
            <h2 className="section-title mt-4">
              Три ingrediента
              <br />
              совершенства
            </h2>
            <div className="divider-gold my-8 max-w-xs" />
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl text-chocolate">Происхождение</h3>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-chocolate/60">
                  Single-origin какао из Эквадора и Мадагаскара. Миндаль из Прованса.
                  Ваниль Bourbon с Réunion.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-chocolate">Мастерство</h3>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-chocolate/60">
                  Tempering шоколада, macaronage до идеальной ножки, бисквиты —
                  воздушные, но насыщенные.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-chocolate">Эмоция</h3>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-chocolate/60">
                  Каждый десерт — повод для маленького чуда. День рождения, proposal
                  или просто вторник, достойный celebration.
                </p>
              </div>
            </div>
          </div>

          {/* Декоративный блок с цитатой */}
          <div className="relative border border-chocolate/10 p-12 lg:p-16 animate-fade-in-up animation-delay-200">
            <div className="absolute left-8 top-8 font-serif text-6xl text-gold/20">&ldquo;</div>
            <blockquote className="relative font-serif text-2xl font-light italic leading-relaxed text-chocolate md:text-3xl">
              Сладость — это не просто вкус. Это воспоминание, которое остаётся
              с вами навсегда.
            </blockquote>
            <p className="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-gold">
              — Основатель Chocolat.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

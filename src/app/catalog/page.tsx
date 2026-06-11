/**
 * Страница каталога с фильтрацией по категориям через searchParams.
 * Адаптивная сетка: 1 колонка (mobile) → 3 колонки (desktop).
 */

import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getCategories, getCategoryBySlug } from '@/server/functions/categories';
import { getProducts } from '@/server/functions/products';

export const runtime = 'edge';

interface CatalogPageProps {
  searchParams: { category?: string };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const categorySlug = searchParams.category;

  const categories = await getCategories();
  const activeCategory = categorySlug
    ? await getCategoryBySlug(categorySlug)
    : null;

  const products = await getProducts(activeCategory?.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Заголовок каталога */}
      <div className="text-center">
        <h1 className="section-title">Каталог</h1>
        <p className="section-subtitle mx-auto">
          {activeCategory
            ? activeCategory.description ?? activeCategory.title
            : 'Полная коллекция изысканных кондитерских изделий'}
        </p>
      </div>

      {/* Фильтры по категориям */}
      <nav
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
        aria-label="Фильтр по категориям"
      >
        <Link
          href="/catalog"
          className={`border px-5 py-2 font-sans text-xs uppercase tracking-widest transition-all duration-300 ${
            !categorySlug
              ? 'border-gold bg-gold text-chocolate'
              : 'border-chocolate/20 text-chocolate/60 hover:border-gold hover:text-gold'
          }`}
        >
          Все
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.slug}`}
            className={`border px-5 py-2 font-sans text-xs uppercase tracking-widest transition-all duration-300 ${
              categorySlug === cat.slug
                ? 'border-gold bg-gold text-chocolate'
                : 'border-chocolate/20 text-chocolate/60 hover:border-gold hover:text-gold'
            }`}
          >
            {cat.title}
          </Link>
        ))}
      </nav>

      <div className="divider-gold mx-auto my-12 max-w-md" />

      {/* Сетка товаров или пустое состояние */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-chocolate/60">
            В этой категории пока нет товаров
          </p>
          <Link href="/catalog" className="btn-outline mt-8 inline-flex">
            Смотреть все
          </Link>
        </div>
      )}
    </div>
  );
}

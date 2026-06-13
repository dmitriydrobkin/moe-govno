/**
 * Страница каталога.
 * Демонстрирует использование searchParams для фильтрации данных
 * на стороне сервера перед рендерингом (Server Components).
 */

import { ProductCard } from '@/components/ProductCard';
import { getCategories } from '@/server/functions/categories';
import { getProducts } from '@/server/functions/products';
import Link from 'next/link';
// ИМПОРТИРУЕМ ТИП КАТЕГОРИИ
import type { Category } from '@/server/db/schema';

export const runtime = 'edge';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const currentCategorySlug = searchParams.category;

  // Запрашиваем данные параллельно для ускорения загрузки
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(currentCategorySlug),
  ]);

  const currentCategory = categories.find(
    (c) => c.slug === currentCategorySlug
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Заголовок каталога */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl text-chocolate md:text-5xl">
          {currentCategory ? currentCategory.title : 'Весь каталог'}
        </h1>
        {currentCategory?.description && (
          <p className="mt-4 font-sans text-sm font-light text-chocolate/70">
            {currentCategory.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Боковая панель с категориями (Фильтры) */}
        <aside className="lg:w-64">
          <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
            Коллекции
          </h3>
          <nav className="mt-6 flex flex-col gap-3">
            <Link
              href="/catalog"
              className={`font-sans text-sm transition-colors ${
                !currentCategorySlug
                  ? 'text-chocolate font-medium'
                  : 'text-chocolate/60 hover:text-chocolate'
              }`}
            >
              Все
            </Link>
            {/* ЯВНО УКАЗЫВАЕМ ТИП Category ДЛЯ ПЕРЕМЕННОЙ cat */}
            {categories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className={`font-sans text-sm transition-colors ${
                  currentCategorySlug === cat.slug
                    ? 'text-chocolate font-medium'
                    : 'text-chocolate/60 hover:text-chocolate'
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Сетка товаров */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex h-64 items-center justify-center border border-dashed border-chocolate/20">
              <p className="font-sans text-sm text-chocolate/50">
                В этой категории пока нет товаров.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

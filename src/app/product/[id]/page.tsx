/**
 * Страница отдельного товара с динамическим роутингом [id].
 * Двухколоночный layout: фото слева, детали и «В корзину» справа.
 */

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartSection } from '@/components/AddToCartButton';
import { getProductById } from '@/server/functions/products';
import { getCategories } from '@/server/functions/categories';
import { formatPrice, getProductImageUrl } from '@/lib/format';
// ИМПОРТИРУЕМ ТИП Category ДЛЯ СТРОГОЙ ТИПИЗАЦИИ
import type { Category } from '@/server/db/schema';

export const runtime = 'edge';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  // ЯВНО УКАЗЫВАЕМ ТИП (c: Category)
  const category = categories.find((c: Category) => c.id === product.categoryId);
  const imageUrl = getProductImageUrl(product.imageUrl);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Хлебные крошки */}
      <nav className="mb-12 font-sans text-xs uppercase tracking-widest text-chocolate/40">
        <Link href="/" className="transition-colors duration-300 hover:text-gold">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="transition-colors duration-300 hover:text-gold">
          Каталог
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/catalog?category=${category.slug}`}
              className="transition-colors duration-300 hover:text-gold"
            >
              {category.title}
            </Link>
          </>
        )}
      </nav>

      {/* Двухколоночный layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Левая колонка — фото */}
        <div className="relative aspect-square overflow-hidden bg-cream-dark animate-fade-in">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.isBestseller && (
            <span className="absolute left-6 top-6 bg-chocolate/90 px-4 py-2 font-sans text-xs uppercase tracking-widest text-gold">
              Бестселлер
            </span>
          )}
        </div>

        {/* Правая колонка — детали */}
        <div className="flex flex-col justify-center animate-fade-in-up">
          {category && (
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
              {category.title}
            </p>
          )}

          <h1 className="mt-4 font-serif text-4xl font-light text-chocolate md:text-5xl">
            {product.title}
          </h1>

          <p className="mt-6 font-serif text-3xl text-gold">
            {formatPrice(product.price)}
          </p>

          <div className="divider-gold my-8" />

          {/* Описание / состав */}
          {product.description && (
            <div>
              <h2 className="font-sans text-xs uppercase tracking-widest text-chocolate/60">
                Описание
              </h2>
              <p className="mt-3 font-sans text-base font-light leading-relaxed text-chocolate/70">
                {product.description}
              </p>
            </div>
          )}

          {/* Статус наличия */}
          <p className="mt-6 font-sans text-sm text-chocolate/50">
            {product.inStock ? (
              <span className="text-gold">● В наличии</span>
            ) : (
              <span className="text-chocolate/40">● Нет в наличии</span>
            )}
          </p>

          {/* Кнопка добавления в корзину (клиентский компонент) */}
          <AddToCartSection product={product} />
        </div>
      </div>
    </div>
  );
}

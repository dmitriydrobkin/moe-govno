/**
 * Страница отдельного товара с динамическим роутингом [id].
 * Двухколоночный layout: слайдер фото слева, детали и «В корзину» справа.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartSection } from '@/components/AddToCartButton';
import { getProductById } from '@/server/functions/products';
import { getCategories } from '@/server/functions/categories';
import { formatPrice } from '@/lib/format';
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

  const category = categories.find((c: Category) => c.id === product.categoryId);
  
  // ⚡️ Превращаем строку с картинками из базы в нормальный массив
  const imagesArray = product.imageUrl ? product.imageUrl.split(',') : [];

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
        
        {/* ЛЕВАЯ КОЛОНКА — ФОТО ИЛИ СЛАЙДЕР */}
        <div className="animate-fade-in">
          {imagesArray.length === 0 ? (
            // Если фото нет — показываем заглушку
            <div className="w-full aspect-square bg-chocolate/5 border border-chocolate/10 flex items-center justify-center text-chocolate/30 font-sans text-sm">
              Нет фотографии
            </div>
          ) : imagesArray.length === 1 ? (
            // Если фото ОДНО — выводим статично
            <div className="relative w-full aspect-square">
              <img 
                src={imagesArray[0]} 
                alt={product.title} 
                className="w-full h-full object-cover border border-chocolate/10 shadow-sm" 
              />
              {product.isBestseller && (
                <span className="absolute left-6 top-6 bg-chocolate/90 px-4 py-2 font-sans text-xs uppercase tracking-widest text-gold z-10">
                  Бестселлер
                </span>
              )}
            </div>
          ) : (
            // ⚡️ СЛАЙДЕР, ЕСЛИ ФОТО БОЛЬШЕ 1
            <div className="relative group">
              <div className="w-full aspect-square flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth border border-chocolate/10 shadow-sm">
                {imagesArray.map((url, index) => (
                  <div 
                    key={index} 
                    className="w-full aspect-square flex-shrink-0 snap-start snap-always relative"
                  >
                    <img 
                      src={url} 
                      alt={`${product.title} - ракурс ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    {product.isBestseller && index === 0 && (
                      <span className="absolute left-6 top-6 bg-chocolate/90 px-4 py-2 font-sans text-xs uppercase tracking-widest text-gold z-10">
                        Бестселлер
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Подсказка для слайдера */}
              <div className="absolute bottom-4 right-4 bg-chocolate/80 text-cream px-3 py-1 text-xs font-sans uppercase tracking-wider backdrop-blur-sm rounded pointer-events-none">
                Листайте ракурсы ↔
              </div>
            </div>
          )}
        </div>

        {/* ПРАВАЯ КОЛОНКА — ДЕТАЛИ */}
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

          {/* Описание */}
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

          {/* Вес и состав (если есть) */}
          {(product.weightInfo || product.ingredients) && (
            <div className="mt-6 space-y-3">
              {product.weightInfo && (
                <p className="font-sans text-sm text-chocolate/70">
                  <span className="uppercase tracking-widest text-xs text-chocolate/60 mr-2">Вес/Объем:</span> 
                  {product.weightInfo}
                </p>
              )}
              {product.ingredients && (
                <p className="font-sans text-sm text-chocolate/70">
                  <span className="uppercase tracking-widest text-xs text-chocolate/60 mr-2">Состав:</span> 
                  {product.ingredients}
                </p>
              )}
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

          {/* Кнопка добавления в корзину */}
          <div className="mt-2">
            <AddToCartSection product={product} />
          </div>
        </div>
        
      </div>
    </div>
  );
}

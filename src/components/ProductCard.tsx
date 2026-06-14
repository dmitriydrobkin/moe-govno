/**
 * Карточка товара для каталога и секции бестселлеров.
 * Hover-эффект приближения фото — через CSS scale на group-hover.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/server/db/schema';
import { formatPrice, getProductImageUrl } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  // ⚡️ ИСПРАВЛЕНИЕ: Берем только ПЕРВУЮ картинку, если их несколько
  const firstImage = product.imageUrl ? product.imageUrl.split(',')[0] : null;
  const imageUrl = getProductImageUrl(firstImage);

  return (
    <article
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {product.isBestseller && (
            <span className="absolute left-4 top-4 bg-chocolate/90 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-gold">
              Бестселлер
            </span>
          )}

          {!product.inStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-chocolate/60 font-sans text-xs uppercase tracking-widest text-cream">
              Нет в наличии
            </span>
          )}
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="font-serif text-xl font-light text-chocolate transition-colors duration-300 group-hover:text-gold">
            {product.title}
          </h3>
          <p className="font-serif text-lg text-gold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
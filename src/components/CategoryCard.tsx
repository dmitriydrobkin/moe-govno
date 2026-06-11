/**
 * Карточка категории для сетки на главной странице.
 * Серверный компонент — получает данные через props.
 */

import Link from 'next/link';
import type { Category } from '@/server/db/schema';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/catalog?category=${category.slug}`}
      className="group relative overflow-hidden border border-chocolate/10 bg-cream p-8 transition-all duration-300 hover:border-gold/40 hover:shadow-lg animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Декоративная золотая линия сверху */}
      <div className="absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />

      <h3 className="font-serif text-2xl font-light text-chocolate transition-colors duration-300 group-hover:text-gold">
        {category.title}
      </h3>

      {category.description && (
        <p className="mt-3 font-sans text-sm font-light leading-relaxed text-chocolate/50 transition-colors duration-300 group-hover:text-chocolate/70">
          {category.description}
        </p>
      )}

      <span className="mt-6 inline-block font-sans text-xs uppercase tracking-[0.2em] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Смотреть →
      </span>
    </Link>
  );
}

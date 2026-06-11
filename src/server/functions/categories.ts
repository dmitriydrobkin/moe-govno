/**
 * Серверные функции для безопасного чтения категорий из D1.
 * При пустой базе возвращают mock-данные для корректного отображения UI.
 */

import { db } from '@/server/db';
import { categories } from '@/server/db/schema';
import { MOCK_CATEGORIES } from '@/server/functions/mock-data';
import { eq, asc } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * Получить все категории, отсортированные по id.
 * Fallback на MOCK_CATEGORIES, если таблица пуста или произошла ошибка.
 */
export async function getCategories() {
  try {
    const result = await db.select().from(categories).orderBy(asc(categories.id));
    return result.length > 0 ? result : MOCK_CATEGORIES;
  } catch {
    return MOCK_CATEGORIES;
  }
}

/**
 * Получить одну категорию по slug для фильтрации каталога.
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (result[0]) return result[0];

    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  } catch {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}

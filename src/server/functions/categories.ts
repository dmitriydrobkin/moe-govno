/**
 * Серверные функции для безопасного чтения категорий из D1.
 */
import { db } from '@/server/db';
import { categories } from '@/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const runtime = 'edge';

export async function getCategories() {
  try {
    return await db.select().from(categories).orderBy(asc(categories.id));
  } catch (error) {
    console.error('Ошибка getCategories:', error);
    return []; // ⚡️ Возвращаем пустоту вместо фейков
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Ошибка getCategoryBySlug:', error);
    return null;
  }
}
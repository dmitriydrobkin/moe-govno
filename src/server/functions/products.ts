/**
 * Серверные функции для безопасного чтения товаров из D1.
 */
import { db } from '@/server/db';
import { products } from '@/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const runtime = 'edge';

export async function getProducts(categoryId?: number) {
  try {
    const query = categoryId
      ? db.select().from(products).where(eq(products.categoryId, categoryId)).orderBy(asc(products.id))
      : db.select().from(products).orderBy(asc(products.id));

    return await query;
  } catch (error) {
    console.error('Ошибка getProducts:', error);
    return []; // ⚡️ Если товаров нет, возвращаем пустоту, а не фейки
  }
}

export async function getBestsellers() {
  try {
    return await db.select().from(products).where(eq(products.isBestseller, true)).orderBy(asc(products.id));
  } catch (error) {
    console.error('Ошибка getBestsellers:', error);
    return []; 
  }
}

export async function getProductById(id: number) {
  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Ошибка getProductById:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Ошибка getProductBySlug:', error);
    return null;
  }
}

export async function isProductInStock(productId: number) {
  try {
    const result = await db.select({ inStock: products.inStock }).from(products).where(eq(products.id, productId)).limit(1);
    return result[0] ? result[0].inStock : false;
  } catch (error) {
    console.error('Ошибка isProductInStock:', error);
    return false;
  }
}
/**
 * Серверные функции для безопасного чтения товаров из D1.
 * Поддерживают фильтрацию по категории и выборку бестселлеров.
 */

import { db } from '@/server/db';
import { products } from '@/server/db/schema';
import { MOCK_PRODUCTS } from '@/server/functions/mock-data';
import { eq, asc } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * Получить все товары с опциональной фильтрацией по categoryId.
 */
export async function getProducts(categoryId?: number) {
  try {
    const query = categoryId
      ? db
          .select()
          .from(products)
          .where(eq(products.categoryId, categoryId))
          .orderBy(asc(products.id))
      : db.select().from(products).orderBy(asc(products.id));

    const result = await query;
    if (result.length > 0) return result;

    if (categoryId) {
      return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
    }
    return MOCK_PRODUCTS;
  } catch {
    if (categoryId) {
      return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
    }
    return MOCK_PRODUCTS;
  }
}

/**
 * Получить товары с флагом is_bestseller для секции на главной.
 */
export async function getBestsellers() {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.isBestseller, true))
      .orderBy(asc(products.id));

    if (result.length > 0) return result;
    return MOCK_PRODUCTS.filter((p) => p.isBestseller);
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.isBestseller);
  }
}

/**
 * Получить один товар по числовому id для страницы продукта.
 */
export async function getProductById(id: number) {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (result[0]) return result[0];
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

/**
 * Получить товар по slug (вспомогательный метод для SEO-URL).
 */
export async function getProductBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (result[0]) return result[0];
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

/**
 * Проверить наличие товара на складе перед добавлением в заказ.
 */
export async function isProductInStock(productId: number) {
  try {
    const result = await db
      .select({ inStock: products.inStock })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (result[0]) return result[0].inStock;
    const mock = MOCK_PRODUCTS.find((p) => p.id === productId);
    return mock?.inStock ?? false;
  } catch {
    const mock = MOCK_PRODUCTS.find((p) => p.id === productId);
    return mock?.inStock ?? false;
  }
}

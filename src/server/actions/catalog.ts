import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { categories, products } from '@/server/db/schema';

export const runtime = 'edge';

export async function createCategory(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const name = formData.get('name')?.toString();
  const slug = formData.get('slug')?.toString();

  if (!name || !slug) return { error: 'Name and slug are required' };

  await db.insert(categories).values({
    name,
    slug,
  });
}

export async function createProduct(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const title = formData.get('title')?.toString();
  const sku = formData.get('sku')?.toString();
  const priceStr = formData.get('price')?.toString();
  const categoryIdStr = formData.get('categoryId')?.toString();
  const description = formData.get('description')?.toString();
  const weightInfo = formData.get('weightInfo')?.toString();
  const ingredients = formData.get('ingredients')?.toString();

  if (!title || !sku || !priceStr || !categoryIdStr) {
    return { error: 'Title, sku, price, and category are required' };
  }

  // Конвертация из гривен в копейки
  const price = Math.round(parseFloat(priceStr) * 100);
  const categoryId = parseInt(categoryIdStr, 10);

  await db.insert(products).values({
    title,
    sku,
    price,
    categoryId,
    description: description || null,
    weightInfo: weightInfo || null,
    ingredients: ingredients || null,
  });
}

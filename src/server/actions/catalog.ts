'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { categories, products } from '@/server/db/schema';

// ❌ УДАЛИЛИ export const runtime = 'edge';

export async function createCategory(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();

  if (!title || !slug) {
    throw new Error('Title and slug are required');
  }

  await db.insert(categories).values({
    title,
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
    throw new Error('Title, sku, price, and category are required');
  }

  const price = Math.round(parseFloat(priceStr) * 100);
  const categoryId = parseInt(categoryIdStr, 10);
  const slug = `p-${sku.toLowerCase()}-${Date.now()}`;

  await db.insert(products).values({
    title,
    sku,
    slug,
    price,
    categoryId,
    description: description || null,
    weightInfo: weightInfo || null,
    ingredients: ingredients || null,
  });
}
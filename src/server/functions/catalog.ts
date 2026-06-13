import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/server/db';
import { categories, products } from '@/server/db/schema';

export const runtime = 'edge';

export async function getCategories() {
  noStore();
  try {
    return await db.select().from(categories).all();
  } catch (error) {
    console.error('Ошибка чтения categories:', error);
    return [];
  }
}

export async function getProducts() {
  noStore();
  try {
    return await db.select().from(products).all();
  } catch (error) {
    console.error('Ошибка чтения products:', error);
    return [];
  }
}

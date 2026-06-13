import { unstable_noStore as noStore } from 'next/cache';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { categories, products } from '@/server/db/schema';

export const runtime = 'edge';

export async function getCategories() {
  noStore();
  const { env } = getRequestContext();
  const db = drizzle(env.DB);
  
  return await db.select().from(categories).all();
}

export async function getProducts() {
  noStore();
  const { env } = getRequestContext();
  const db = drizzle(env.DB);
  
  return await db.select().from(products).all();
}

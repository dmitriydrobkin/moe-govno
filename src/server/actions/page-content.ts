'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { pageContent } from '@/server/db/schema';

// ❌ УДАЛИЛИ export const runtime = 'edge';

export async function savePageContent(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const pageRoute = formData.get('pageRoute')?.toString();
  
  if (!pageRoute) {
    throw new Error('pageRoute is required');
  }

  const keys = ['h1', 'description', 'seoTitle', 'seoDescription'];

  for (const key of keys) {
    const value = formData.get(key)?.toString();
    if (value !== undefined) {
      await db.insert(pageContent)
        .values({
          pageRoute,
          key,
          value,
        })
        .onConflictDoUpdate({
          target: [pageContent.pageRoute, pageContent.key],
          set: { value },
        });
    }
  }
}
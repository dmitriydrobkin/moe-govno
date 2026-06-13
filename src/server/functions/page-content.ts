import { unstable_noStore as noStore } from 'next/cache';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { pageContent } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function getPageContent(route: string) {
  noStore();
  
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const results = await db.select()
    .from(pageContent)
    .where(eq(pageContent.pageRoute, route));
    
  const contentMap: Record<string, string> = {};
  for (const row of results) {
    contentMap[row.key] = row.value;
  }
  
  return contentMap;
}

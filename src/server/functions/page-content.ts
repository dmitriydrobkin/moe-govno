import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/server/db';
import { pageContent } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function getPageContent(route: string) {
  noStore();
  
  try {
    const results = await db.select()
      .from(pageContent)
      .where(eq(pageContent.pageRoute, route));
      
    const contentMap: Record<string, string> = {};
    for (const row of results) {
      contentMap[row.key] = row.value;
    }
    
    return contentMap;
  } catch (error) {
    console.error('Ошибка чтения pageContent:', error);
    // Безопасный возврат пустого объекта, чтобы страница не падала
    return {};
  }
}

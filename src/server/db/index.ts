import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/server/db/schema';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

/**
 * В Cloudflare Pages мы не можем инициализировать D1 глобально.
 * Мы используем Proxy, чтобы при каждом обращении к `db` 
 * Next.js динамически доставал актуальное подключение из контекста запроса.
 */
export const db = new Proxy({} as any, {
  get(_, prop) {
    const { env } = getRequestContext();
    
    if (!env || !env.DB) {
      throw new Error('⚠️ База данных D1 не найдена в переменных окружения (env.DB)');
    }

    const client = drizzle(env.DB, { schema });
    return (client as any)[prop];
  },
});

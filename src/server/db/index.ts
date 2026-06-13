import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/server/db/schema';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

export const db = new Proxy({} as any, {
  get(_, prop) {
    let env;
    try {
      // Во время статической сборки (Node.js) контекста нет, ловим ошибку
      const ctx = getOptionalRequestContext();
      env = ctx?.env;
    } catch (e) {
      env = null;
    }

    if (!env || !env.DB) {
      // Если базы нет (этап сборки страницы), отдаем пустышку, чтобы не ронять билд
      if (prop === 'select') {
        return () => ({
          from: () => Promise.resolve([]),
        });
      }
      return () => Promise.resolve();
    }

    const client = drizzle(env.DB, { schema });
    const value = (client as any)[prop];
    
    // ⚡ КРИТИЧНО ДЛЯ СОХРАНЕНИЯ: Привязываем контекст (this) для функций записи (insert, update)
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

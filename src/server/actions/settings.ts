'use server';

import { drizzle } from 'drizzle-orm/d1';
import { siteSettings } from '@/server/db/schema';
import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Серверное действие для обновления настроек сайта.
 * Работает напрямую с контекстом Cloudflare, минуя Proxy.
 */
export async function updateSiteSettings(formData: FormData) {
  // 1. Получаем базу данных напрямую
  const { env } = getRequestContext();
  
  if (!env || !env.DB) {
    throw new Error('КРИТИЧЕСКАЯ ОШИБКА: База D1 не подключена в панели Cloudflare (переменная DB)');
  }

  const db = drizzle(env.DB);

  // 2. Достаем данные из формы
  const title = formData.get('site_title') as string;
  const description = formData.get('site_description') as string;
  const indexingEnabled = formData.get('seo_indexing_enabled') === 'on' ? 'true' : 'false';

  const settingsToSave = [
    { key: 'site_title', value: title },
    { key: 'site_description', value: description },
    { key: 'seo_indexing_enabled', value: indexingEnabled },
  ];

  // 3. Сохраняем в D1
  for (const setting of settingsToSave) {
    await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: setting.value },
      });
  }
}

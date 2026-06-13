'use server';

import { db } from '@/server/db';
import { siteSettings } from '@/server/db/schema';
import { revalidatePath } from 'next/cache';

/**
 * Серверное действие для обновления настроек сайта.
 * Вызывается напрямую из формы в админке.
 */
export async function updateSiteSettings(formData: FormData) {
  // Достаем данные из полей формы
  const title = formData.get('site_title') as string;
  const description = formData.get('site_description') as string;
  
  // Если галочка нажата (on), пишем 'true', иначе 'false'
  const indexingEnabled = formData.get('seo_indexing_enabled') === 'on' ? 'true' : 'false';

  const settingsToSave = [
    { key: 'site_title', value: title },
    { key: 'site_description', value: description },
    { key: 'seo_indexing_enabled', value: indexingEnabled },
  ];

  // Проходимся по настройкам и безопасно пишем в базу. 
  // onConflictDoUpdate гарантирует, что если ключ уже есть, он просто обновится.
  for (const setting of settingsToSave) {
    await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: setting.value },
      });
  }

  // Магия Next.js: принудительно сбрасываем кэш всего сайта,
  // чтобы покупатели моментально увидели новый текст!
  revalidatePath('/', 'layout');
}

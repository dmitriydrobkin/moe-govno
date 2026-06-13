'use server';

import { db } from '@/server/db';
import { siteSettings } from '@/server/db/schema';

/**
 * Серверное действие для обновления настроек сайта.
 */
export async function updateSiteSettings(formData: FormData) {
  const title = formData.get('site_title') as string;
  const description = formData.get('site_description') as string;
  const indexingEnabled = formData.get('seo_indexing_enabled') === 'on' ? 'true' : 'false';

  const settingsToSave = [
    { key: 'site_title', value: title },
    { key: 'site_description', value: description },
    { key: 'seo_indexing_enabled', value: indexingEnabled },
  ];

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

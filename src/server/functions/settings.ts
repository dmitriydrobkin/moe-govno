import { db } from '@/server/db';
import { siteSettings } from '@/server/db/schema';
import type { SiteSetting } from '@/server/db/schema';

/**
 * Безопасно загружает динамические настройки сайта из базы D1.
 * Если таблицы нет или она пуста, возвращает пустой объект, не ломая сайт.
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings);
    
    // Превращаем массив строк [{key: 'hero_title', value: '...'}] в удобный объект
    const settingsMap: Record<string, string> = {};
    rows.forEach((row: SiteSetting) => {
      settingsMap[row.key] = row.value;
    });
    
    return settingsMap;
  } catch (error) {
    console.error('⚠️ Настройки сайта еще не настроены в D1 или таблица пуста:', error);
    return {}; // Возвращаем пустой объект в случае любого сбоя
  }
}

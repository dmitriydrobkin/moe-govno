/**
 * Главная страница панели администратора.
 * Позволяет управлять SEO и глобальными настройками.
 */

import { getSiteSettings } from '@/server/functions/settings';
import { updateSiteSettings } from '@/server/actions/settings';
import { SubmitButton } from '@/components/SubmitButton'; // Подключаем нашу умную кнопку

export const runtime = 'edge';

export default async function AdminPage() {
  // Подтягиваем текущие настройки, чтобы подставить их в форму
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-cream-dark py-16 text-chocolate">
      <div className="mx-auto max-w-2xl bg-cream p-10 shadow-sm border border-chocolate/5">
        <h1 className="font-serif text-3xl mb-2">Настройки сайта</h1>
        <p className="font-sans text-sm text-chocolate/50 mb-8">
          Изменения применяются моментально для всех пользователей.
        </p>
        
        {/* Форма вызывает нашу серверную функцию updateSiteSettings */}
        <form action={updateSiteSettings} className="space-y-6">
          
          {/* Поле: Название сайта */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
              Название сайта (SEO Title)
            </label>
            <input 
              type="text" 
              name="site_title" 
              defaultValue={settings.site_title ?? 'Chocolat. — Премиальная кондитерская'} 
              className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
            />
          </div>

          {/* Поле: Описание */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
              Описание для Google (Description)
            </label>
            <textarea 
              name="site_description" 
              defaultValue={settings.site_description ?? ''} 
              rows={3}
              placeholder="Введите короткое описание для поисковиков..."
              className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold resize-none"
            />
          </div>

          <div className="divider-gold my-6 opacity-30" />

          {/* Поле: Тумблер индексации */}
          <div className="flex items-start gap-4">
            <input 
              type="checkbox" 
              name="seo_indexing_enabled" 
              id="seo_indexing_enabled"
              defaultChecked={settings.seo_indexing_enabled === 'true'}
              className="mt-1 h-5 w-5 accent-gold"
            />
            <label htmlFor="seo_indexing_enabled" className="text-sm font-sans leading-relaxed">
              <strong>Разрешить индексацию поисковиками</strong><br/>
              <span className="text-chocolate/60">Если выключено, сайт будет скрыт от Google и Яндекс (идеально на этапе разработки).</span>
            </label>
          </div>

          {/* Наша новая умная кнопка с сохранением твоих стилей */}
          <SubmitButton 
            defaultText="Сохранить настройки"
            loadingText="Сохраняем..."
            successText="Настройки обновлены!"
            className="btn-primary w-full mt-8"
          />
        </form>
      </div>
    </div>
  );
}

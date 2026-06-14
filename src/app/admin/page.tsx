/**
 * Главная страница панели администратора.
 * Позволяет управлять глобальными настройками SEO и контентом отдельных страниц.
 */

import { getSiteSettings } from '@/server/functions/settings';
import { updateSiteSettings } from '@/server/actions/settings';
import { getPageContent } from '@/server/functions/page-content';
import { savePageContent } from '@/server/actions/page-content';
import { SubmitButton } from '@/components/SubmitButton';

export const runtime = 'edge';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { route?: string };
}) {
  const settings = await getSiteSettings();
  const selectedRoute = searchParams.route || '/';
  const content = await getPageContent(selectedRoute) || {};

  return (
    <div className="min-h-screen bg-cream-dark py-16 text-chocolate space-y-12 px-4">
      
      {/* ================= БЛОК 1: ГЛОБАЛЬНЫЕ НАСТРОЙКИ ================= */}
      <div className="mx-auto max-w-3xl bg-cream p-10 shadow-sm border border-chocolate/5">
        <h1 className="font-serif text-3xl mb-2">Глобальные настройки сайта</h1>
        <p className="font-sans text-sm text-chocolate/50 mb-8">
          Базовые параметры SEO, тексты главной страницы и индексация.
        </p>
        
        <form action={updateSiteSettings} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
                Бейдж главной страницы
              </label>
              <input 
                type="text" 
                name="hero_badge" 
                defaultValue={settings.hero_badge ?? 'Maison de Pâtisserie'} 
                className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
              Глобальное описание (SEO Description)
            </label>
            <textarea 
              name="site_description" 
              defaultValue={settings.site_description ?? ''} 
              rows={2}
              className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold resize-none"
            />
          </div>

          <div className="divider-gold my-6 opacity-30" />
          <h3 className="font-serif text-xl mb-4">Тексты на главном экране</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Заголовок 1</label>
              <input 
                type="text" 
                name="hero_title_1" 
                defaultValue={settings.hero_title_1 ?? 'Искусство'} 
                className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Заголовок 2 (курсив)</label>
              <input 
                type="text" 
                name="hero_title_italic" 
                defaultValue={settings.hero_title_italic ?? 'сладкого'} 
                className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Описание под заголовком</label>
            <textarea 
              name="hero_description" 
              defaultValue={settings.hero_description ?? 'Каждое изделие — маленький шедевр. Бельгийский шоколад, свежие ягоды и безупречное мастерство.'} 
              rows={2}
              className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold resize-none"
            />
          </div>

          <div className="divider-gold my-6 opacity-30" />

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
              <span className="text-chocolate/60">Если выключено, сайт будет скрыт от Google и Яндекс.</span>
            </label>
          </div>

          <SubmitButton defaultText="Сохранить глобальные настройки" className="btn-primary w-full mt-8" />
        </form>
      </div>

      {/* ================= БЛОК 2: КОНТЕНТ КОНКРЕТНЫХ СТРАНИЦ ================= */}
      <div className="mx-auto max-w-3xl bg-cream p-10 shadow-sm border border-chocolate/5">
        <h2 className="font-serif text-3xl mb-2">Контент страниц</h2>
        <p className="font-sans text-sm text-chocolate/50 mb-8">
          Управление текстами и заголовками для каждого раздела сайта.
        </p>

        <form method="GET" className="flex items-end gap-4 mb-8 bg-cream-dark/50 p-4 border border-chocolate/10">
          <div className="flex-1">
            <label htmlFor="routeSelect" className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
              Выберите страницу
            </label>
            <select
              id="routeSelect"
              name="route"
              defaultValue={selectedRoute}
              className="w-full border border-chocolate/20 px-4 py-3 bg-cream font-sans text-sm outline-none transition-colors focus:border-gold"
            >
              <option value="/">Главная (/)</option>
              <option value="/catalog">Каталог (/catalog)</option>
              <option value="/about">О нас (/about)</option>
            </select>
          </div>
          <button type="submit" className="btn-outline px-8 py-3 h-[46px]">
            Выбрать
          </button>
        </form>

        <div className="divider-gold my-8 opacity-30" />

        <form action={savePageContent} className="space-y-6">
          <input type="hidden" name="pageRoute" value={selectedRoute} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Главный заголовок (H1)</label>
              <input
                type="text"
                name="h1"
                defaultValue={content.h1 || ''}
                className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">SEO Title страницы</label>
              <input
                type="text"
                name="seoTitle"
                defaultValue={content.seoTitle || ''}
                className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Текстовое описание</label>
            <textarea
              name="description"
              defaultValue={content.description || ''}
              rows={4}
              className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold resize-none"
            />
          </div>

          <SubmitButton defaultText={`Сохранить контент для ${selectedRoute}`} className="btn-primary w-full mt-4" />
        </form>
      </div>
    </div>
  );
}
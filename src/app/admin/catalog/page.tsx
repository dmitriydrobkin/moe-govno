import Link from 'next/link'; // ⚡️ Добавили импорт Link для сброса фильтров
import { SubmitButton } from '@/components/SubmitButton';
import { DeleteButton } from '@/components/DeleteButton';
import { ImageUploadInput } from '@/components/ImageUploadInput';
import { createCategory, createProduct, deleteCategory, deleteProduct } from '@/server/actions/catalog';
import { getCategories, getProducts } from '@/server/functions/catalog';
import type { Category, Product } from '@/server/db/schema';

export const runtime = 'edge';

interface CatalogPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const categories = await getCategories();
  const products = await getProducts();

  // ⚡️ НАВИГАЦИЯ И ФИЛЬТРАЦИЯ ДАННЫХ НА СЕРВЕРЕ
  let filteredProducts = [...products];

  if (searchParams.search) {
    const searchLow = searchParams.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p: Product) =>
        p.title.toLowerCase().includes(searchLow) ||
        (p.sku && p.sku.toLowerCase().includes(searchLow))
    );
  }

  if (searchParams.category) {
    const catId = parseInt(searchParams.category, 10);
    filteredProducts = filteredProducts.filter((p: Product) => p.categoryId === catId);
  }

  return (
    <div className="min-h-screen bg-cream-dark py-16 text-chocolate px-4">
      <div className="mx-auto max-w-6xl space-y-12">
        
        <div>
          <h1 className="font-serif text-3xl mb-2">Управление каталогом</h1>
          <p className="font-sans text-sm text-chocolate/50">
            Добавляйте новые категории, управляйте витриной десертов и настраивайте бестселлеры.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= ЛЕВАЯ КОЛОНКА: КАТЕГОРИИ ================= */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-cream p-8 shadow-sm border border-chocolate/5">
              <h2 className="font-serif text-xl mb-6">Новая категория</h2>
              <form action={createCategory} className="space-y-6">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-1">
                    Название категории
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Например: Авторские торты"
                    className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-1">
                    Ссылка для сайта (Slug / URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    placeholder="Например: torty"
                    pattern="^[a-z0-9-]+$"
                    title="Используйте только маленькие латинские буквы, цифры и дефис"
                    className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                  />
                  <p className="mt-1 text-[11px] font-sans text-chocolate/50 leading-normal">
                    * Часть адреса страницы. Пишется <strong>строго латиницей</strong>, без пробелов.
                  </p>
                </div>
                
                <SubmitButton
                  defaultText="Добавить категория"
                  loadingText="Добавление..."
                  successText="Создано!"
                  className="btn-primary w-full mt-2"
                />
              </form>
            </div>

            <div className="bg-cream p-8 shadow-sm border border-chocolate/5">
              <h2 className="font-serif text-xl mb-4">Существующие категории</h2>
              {categories.length === 0 ? (
                <p className="text-sm text-chocolate/60">Категорий пока нет</p>
              ) : (
                <ul className="space-y-3">
                  {categories.map((cat: Category) => (
                    <li key={cat.id} className="text-sm font-sans flex justify-between items-center border-b border-chocolate/10 pb-2">
                      <div>
                        <span className="font-medium mr-2">{cat.title}</span>
                        <span className="text-chocolate/50 text-xs bg-chocolate/5 px-2 py-1 rounded">/{cat.slug}</span>
                      </div>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={cat.id} />
                        <DeleteButton />
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ================= ПРАВАЯ КОЛОНКА: ТОВАРЫ ================= */}
          <div className="lg:col-span-2">
            <div className="bg-cream p-8 shadow-sm border border-chocolate/5 h-full">
              <h2 className="font-serif text-xl mb-6">Новый товар</h2>
              
              <form action={createProduct} className="space-y-6">
                
                <ImageUploadInput />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Название товара</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Артикул (SKU)</label>
                    <input
                      type="text"
                      name="sku"
                      required
                      className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Категория</label>
                    <select
                      name="categoryId"
                      required
                      className="w-full border border-chocolate/20 px-4 py-3 bg-cream font-sans text-sm outline-none transition-colors focus:border-gold"
                    >
                      <option value="">Выберите категорию...</option>
                      {categories.map((cat: Category) => (
                         <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Цена (в гривнах)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      required
                      placeholder="0.00"
                      className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                </div>

                {/* ⚡️ ГАЛОЧКА БЕСТСЕЛЛЕРА */}
                <div className="flex items-center gap-3 p-4 bg-chocolate/5 border border-chocolate/10 rounded-sm">
                  <input
                    type="checkbox"
                    name="isBestseller"
                    id="isBestseller"
                    className="h-5 w-5 accent-gold cursor-pointer"
                  />
                  <label htmlFor="isBestseller" className="text-xs font-sans uppercase tracking-widest text-chocolate/80 cursor-pointer select-none">
                    <strong>Добавить в бестселлеры</strong> — товар попадет в блок топ-коллекций на главной странице.
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Описание товара</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Вес / Объем</label>
                    <input
                      type="text"
                      name="weightInfo"
                      placeholder="Например: 500 г"
                      className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Ингредиенты (через запятую)</label>
                    <input
                      type="text"
                      name="ingredients"
                      className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <SubmitButton
                    defaultText="Сохранить товар в каталог"
                    loadingText="Загрузка фотографий..."
                    successText="Товар сохранен!"
                    className="btn-primary w-full"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ================= СПИСОК ТОВАРОВ С НАВИГАЦИЕЙ ================= */}
        <div className="bg-cream p-8 shadow-sm border border-chocolate/5">
          <div className="mb-6">
            <h2 className="font-serif text-xl mb-2">Список товаров</h2>
            <p className="font-sans text-xs text-chocolate/50">Найдено позиций: {filteredProducts.length}</p>
          </div>

          {/* ⚡️ УДОБНАЯ ПАНЕЛЬ НАВИГАЦИИ И ПОИСКА */}
          <form method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-cream-dark/40 p-4 border border-chocolate/10 items-end">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-chocolate/60 mb-2">Поиск по названию / SKU</label>
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ''}
                placeholder="Введите текст для поиска..."
                className="w-full border border-chocolate/20 px-4 py-2 bg-cream font-sans text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-chocolate/60 mb-2">Раздел каталога</label>
              <select
                name="category"
                defaultValue={searchParams.category || ''}
                className="w-full border border-chocolate/20 px-4 py-2 bg-cream font-sans text-sm outline-none transition-colors focus:border-gold"
              >
                <option value="">Все категории</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 py-2 text-xs uppercase tracking-wider font-semibold h-[38px]">
                Найти
              </button>
              {(searchParams.search || searchParams.category) && (
                <Link href="/admin/catalog" className="btn-outline px-4 flex items-center justify-center text-xs uppercase tracking-wider bg-cream h-[38px] hover:text-red-600 hover:border-red-600/30">
                  Сбросить
                </Link>
              )}
            </div>
          </form>

          {filteredProducts.length === 0 ? (
            <p className="text-sm text-chocolate/60 text-center py-8 bg-chocolate/5 border border-dashed border-chocolate/10">Товаров по заданным критериям не найдено</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm border-collapse">
                <thead>
                  <tr className="border-b border-chocolate/20 text-xs uppercase tracking-widest text-chocolate/70">
                    <th className="py-4 px-2 font-normal w-16">Фото</th>
                    <th className="py-4 px-2 font-normal">SKU</th>
                    <th className="py-4 px-2 font-normal">Название</th>
                    <th className="py-4 px-2 font-normal">Категория</th>
                    <th className="py-4 px-2 font-normal">Метка</th>
                    <th className="py-4 px-2 font-normal text-right">Цена (грн)</th>
                    <th className="py-4 px-2 font-normal w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod: Product) => {
                    const catTitle = categories.find((c: Category) => c.id === prod.categoryId)?.title || 'Неизвестно';
                    const firstImage = prod.imageUrl ? prod.imageUrl.split(',')[0] : null;
                    
                    return (
                      <tr key={prod.id} className="border-b border-chocolate/5 hover:bg-chocolate/5 transition-colors">
                        <td className="py-3 px-2">
                          {firstImage ? (
                            <img src={firstImage} alt={prod.title} className="w-12 h-12 object-cover border border-chocolate/10 bg-white" />
                          ) : (
                            <div className="w-12 h-12 bg-chocolate/5 flex items-center justify-center text-xs text-chocolate/30 border border-chocolate/10">Нет</div>
                          )}
                        </td>
                        <td className="py-4 px-2 text-chocolate/70 font-mono text-xs">{prod.sku}</td>
                        <td className="py-4 px-2 font-medium">{prod.title}</td>
                        <td className="py-4 px-2 text-chocolate/70">{catTitle}</td>
                        <td className="py-4 px-2">
                          {prod.isBestseller && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">
                              Топ
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right font-medium">{(prod.price / 100).toFixed(2)} ₴</td>
                        <td className="py-4 px-2 text-right">
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={prod.id} />
                            <DeleteButton />
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
import { SubmitButton } from '@/components/SubmitButton';
import { createCategory, createProduct } from '@/server/actions/catalog';
import { getCategories, getProducts } from '@/server/functions/catalog';

export const runtime = 'edge';

export default async function CatalogPage() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-cream-dark py-16 text-chocolate px-4">
      <div className="mx-auto max-w-6xl space-y-12">
        
        <div>
          <h1 className="font-serif text-3xl mb-2">Управление каталогом</h1>
          <p className="font-sans text-sm text-chocolate/50">
            Добавляйте новые категории и товары в магазин.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= ЛЕВАЯ КОЛОНКА: КАТЕГОРИИ ================= */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-cream p-8 shadow-sm border border-chocolate/5">
              <h2 className="font-serif text-xl mb-6">Новая категория</h2>
              <form action={createCategory} className="space-y-6">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Название</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold"
                  />
                </div>
                <SubmitButton
                  defaultText="Добавить категорию"
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
                  {categories.map((cat) => (
                    <li key={cat.id} className="text-sm font-sans flex justify-between items-center border-b border-chocolate/10 pb-3">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-chocolate/50 text-xs bg-chocolate/5 px-2 py-1 rounded">/{cat.slug}</span>
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
                      {categories.map((cat) => (
                         <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                    defaultText="Добавить товар"
                    loadingText="Добавление..."
                    successText="Товар добавлен!"
                    className="btn-primary w-full"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ================= СПИСОК ТОВАРОВ ================= */}
        <div className="bg-cream p-8 shadow-sm border border-chocolate/5">
          <h2 className="font-serif text-xl mb-6">Список товаров</h2>
          {products.length === 0 ? (
            <p className="text-sm text-chocolate/60">Товаров пока нет</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm border-collapse">
                <thead>
                  <tr className="border-b border-chocolate/20 text-xs uppercase tracking-widest text-chocolate/70">
                    <th className="py-4 px-2 font-normal">SKU</th>
                    <th className="py-4 px-2 font-normal">Название</th>
                    <th className="py-4 px-2 font-normal">Категория</th>
                    <th className="py-4 px-2 font-normal text-right">Цена (грн)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const catName = categories.find(c => c.id === prod.categoryId)?.name || 'Неизвестно';
                    return (
                      <tr key={prod.id} className="border-b border-chocolate/5 hover:bg-chocolate/5 transition-colors">
                        <td className="py-4 px-2 text-chocolate/70">{prod.sku}</td>
                        <td className="py-4 px-2 font-medium">{prod.title}</td>
                        <td className="py-4 px-2 text-chocolate/70">{catName}</td>
                        <td className="py-4 px-2 text-right">{(prod.price / 100).toFixed(2)} ₴</td>
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

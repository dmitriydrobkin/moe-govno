import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';
import { ImageUploadInput } from '@/components/ImageUploadInput';
import { updateProduct } from '@/server/actions/catalog';
import { getCategories } from '@/server/functions/catalog';
import { getProductById } from '@/server/functions/products';
import type { Category } from '@/server/db/schema';

export const runtime = 'edge';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) notFound();

  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories()
  ]);

  if (!product) notFound();

  const imagesArray = product.imageUrl ? product.imageUrl.split(',') : [];

  return (
    <div className="min-h-screen bg-cream-dark py-16 text-chocolate px-4">
      <div className="mx-auto max-w-3xl bg-cream p-8 shadow-sm border border-chocolate/5">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-chocolate/10">
          <div>
            <h1 className="font-serif text-3xl mb-2">Редактирование товара</h1>
            <p className="font-sans text-sm text-chocolate/50">Измените необходимые данные и сохраните.</p>
          </div>
          <Link href="/admin/catalog" className="text-xs uppercase tracking-widest text-chocolate/50 hover:text-gold transition-colors">
            ← Назад в каталог
          </Link>
        </div>

        <form action={updateProduct} className="space-y-6">
          <input type="hidden" name="id" value={product.id} />

          <div className="mb-8 border border-dashed border-chocolate/20 p-6 bg-chocolate/5">
            <p className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-4">Текущие фотографии</p>
            {imagesArray.length > 0 ? (
              <div className="flex gap-4 mb-4 flex-wrap">
                {imagesArray.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-20 h-20 object-cover border border-chocolate/20 shadow-sm bg-white" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-chocolate/40 mb-4">Фотографий нет</p>
            )}
            <p className="text-[11px] font-sans text-chocolate/50 mb-6 leading-relaxed">
              * Если вы хотите оставить эти фото — <strong>ничего не выбирайте ниже</strong>.<br/>
              * Если загрузить новые фото — они <strong>полностью заменят</strong> старую галерею.
            </p>
            <ImageUploadInput />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Название товара</label>
              <input type="text" name="title" defaultValue={product.title} required className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Артикул (SKU)</label>
              <input type="text" name="sku" defaultValue={product.sku} required className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Категория</label>
              <select name="categoryId" defaultValue={product.categoryId} required className="w-full border border-chocolate/20 px-4 py-3 bg-cream font-sans text-sm outline-none transition-colors focus:border-gold">
                {categories.map((cat: Category) => (
                   <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Цена (в гривнах)</label>
              <input type="number" step="0.01" name="price" defaultValue={(product.price / 100).toFixed(2)} required className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/20 rounded-sm">
            <input type="checkbox" name="isBestseller" id="isBestseller" defaultChecked={product.isBestseller ?? false} className="h-5 w-5 accent-gold cursor-pointer" />
            <label htmlFor="isBestseller" className="text-xs font-sans uppercase tracking-widest text-chocolate/80 cursor-pointer select-none">
              <strong>Добавить в бестселлеры</strong> (Вывести на главную страницу)
            </label>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Описание товара</label>
            <textarea name="description" defaultValue={product.description || ''} rows={4} className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Вес / Объем</label>
              <input type="text" name="weightInfo" defaultValue={product.weightInfo || ''} className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">Ингредиенты</label>
              <input type="text" name="ingredients" defaultValue={product.ingredients || ''} className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold" />
            </div>
          </div>

          <div className="pt-4">
            <SubmitButton defaultText="Сохранить изменения" loadingText="Сохранение..." successText="Сохранено!" className="btn-primary w-full" />
          </div>
        </form>

      </div>
    </div>
  );
}

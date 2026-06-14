'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { categories, products } from '@/server/db/schema';
import { uploadToR2 } from '@/server/functions/r2';

export async function createCategory(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();

  if (!title || !slug) {
    throw new Error('Название и Slug обязательны');
  }

  await db.insert(categories).values({ title, slug });
}

export async function createProduct(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const title = formData.get('title')?.toString();
  const sku = formData.get('sku')?.toString();
  const priceStr = formData.get('price')?.toString();
  const categoryIdStr = formData.get('categoryId')?.toString();
  const description = formData.get('description')?.toString();
  const weightInfo = formData.get('weightInfo')?.toString();
  const ingredients = formData.get('ingredients')?.toString();
  
<<<<<<< Updated upstream
  // ⚡️ Извлекаем ВСЕ загруженные файлы (массив) вместо одного
=======
  // ⚡️ Достаем МАССИВ файлов из нашего нового инпута
>>>>>>> Stashed changes
  const imageFiles = formData.getAll('images') as File[];

  if (!title || !sku || !priceStr || !categoryIdStr) {
    throw new Error('Заполните все обязательные поля');
  }

<<<<<<< Updated upstream
  const uploadedUrls: string[] = [];

  // ⚡️ Циклом проходим по всем файлам (ограничим до 10 на уровне UI)
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      if (file.size > 0) {
        const uploadResult = await uploadToR2(file);
        if (!uploadResult.success) {
          throw new Error(`Ошибка загрузки фото: ${uploadResult.error}`);
        }
        if (uploadResult.url) {
          uploadedUrls.push(uploadResult.url);
        }
=======
  const imageUrls: string[] = [];

  // ⚡️ Загружаем все переданные фото по очереди в Cloudflare R2
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const uploadResult = await uploadToR2(file);
      if (!uploadResult.success) {
        throw new Error(`Ошибка загрузки фото: ${uploadResult.error}`);
      }
      if (uploadResult.url) {
        imageUrls.push(uploadResult.url);
>>>>>>> Stashed changes
      }
    }
  }

  // Склеиваем ссылки через запятую в одну строку, если они есть
  const imageUrlsString = uploadedUrls.length > 0 ? uploadedUrls.join(',') : null;

  const price = Math.round(parseFloat(priceStr) * 100);
  const categoryId = parseInt(categoryIdStr, 10);
  const slug = `p-${sku.toLowerCase()}-${Date.now()}`;

<<<<<<< Updated upstream
=======
  // ⚡️ Сохраняем товар. Все ссылки склеиваем через запятую
>>>>>>> Stashed changes
  await db.insert(products).values({
    title,
    sku,
    slug,
    price,
    categoryId,
    description: description || null,
    weightInfo: weightInfo || null,
    ingredients: ingredients || null,
<<<<<<< Updated upstream
    imageUrl: imageUrlsString, // Записываем строку с пачкой ссылок
  });
}
=======
    imageUrl: imageUrls.length > 0 ? imageUrls.join(',') : null, 
  });
}

// ⚡️ ДОБАВЛЕНЫ ФУНКЦИИ УДАЛЕНИЯ
export async function deleteCategory(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);
  const idStr = formData.get('id')?.toString();
  if (!idStr) throw new Error('ID обязателен');
  
  await db.delete(categories).where(eq(categories.id, parseInt(idStr, 10)));
}

export async function deleteProduct(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);
  const idStr = formData.get('id')?.toString();
  if (!idStr) throw new Error('ID обязателен');
  
  await db.delete(products).where(eq(products.id, parseInt(idStr, 10)));
}
>>>>>>> Stashed changes

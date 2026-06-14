'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { categories, products } from '@/server/db/schema';
import { uploadToR2 } from '@/server/functions/r2'; // ⚡️ Подключили нашу утилиту

export async function createCategory(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();

  if (!title || !slug) {
    throw new Error('Название и Slug обязательны');
  }

  await db.insert(categories).values({
    title,
    slug,
  });
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
  
  // ⚡️ Достаем файл картинки из формы
  const imageFile = formData.get('image') as File | null;

  if (!title || !sku || !priceStr || !categoryIdStr) {
    throw new Error('Заполните все обязательные поля');
  }

  let imageUrl = null;

  // ⚡️ Если кондитер загрузил фото, отправляем его в Cloudflare R2
  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadToR2(imageFile);
    if (!uploadResult.success) {
      throw new Error(`Ошибка загрузки фото: ${uploadResult.error}`);
    }
    imageUrl = uploadResult.url; // Получаем готовую ссылку!
  }

  const price = Math.round(parseFloat(priceStr) * 100);
  const categoryId = parseInt(categoryIdStr, 10);
  const slug = `p-${sku.toLowerCase()}-${Date.now()}`;

  // ⚡️ Сохраняем товар с новой ссылкой на фото
  await db.insert(products).values({
    title,
    sku,
    slug,
    price,
    categoryId,
    description: description || null,
    weightInfo: weightInfo || null,
    ingredients: ingredients || null,
    imageUrl: imageUrl, 
  });
}
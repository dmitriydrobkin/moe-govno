'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { categories, products } from '@/server/db/schema';
import { uploadToR2 } from '@/server/functions/r2';
import { redirect } from 'next/navigation'; // ⚡️ ДОБАВИЛИ ДЛЯ ПЕРЕАДРЕСАЦИИ

export async function createCategory(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);
  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();
  if (!title || !slug) throw new Error('Название и Slug обязательны');
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
  const isBestseller = formData.get('isBestseller') === 'on';

  const imageFiles = formData.getAll('images') as File[];

  if (!title || !sku || !priceStr || !categoryIdStr) {
    throw new Error('Заполните все обязательные поля');
  }

  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const uploadResult = await uploadToR2(file);
      if (!uploadResult.success) throw new Error(`Ошибка загрузки фото: ${uploadResult.error}`);
      if (uploadResult.url) imageUrls.push(uploadResult.url);
    }
  }

  const price = Math.round(parseFloat(priceStr) * 100);
  const categoryId = parseInt(categoryIdStr, 10);
  const slug = `p-${sku.toLowerCase()}-${Date.now()}`;

  await db.insert(products).values({
    title, sku, slug, price, categoryId,
    description: description || null,
    weightInfo: weightInfo || null,
    ingredients: ingredients || null,
    imageUrl: imageUrls.length > 0 ? imageUrls.join(',') : null, 
    isBestseller,
  });
}

// ⚡️ НОВАЯ ФУНКЦИЯ ДЛЯ РЕДАКТИРОВАНИЯ
export async function updateProduct(formData: FormData) {
  const { env } = getRequestContext();
  const db = drizzle(env.DB);

  const idStr = formData.get('id')?.toString();
  if (!idStr) throw new Error('ID обязателен');
  const id = parseInt(idStr, 10);

  const title = formData.get('title')?.toString();
  const sku = formData.get('sku')?.toString();
  const priceStr = formData.get('price')?.toString();
  const categoryIdStr = formData.get('categoryId')?.toString();
  const description = formData.get('description')?.toString();
  const weightInfo = formData.get('weightInfo')?.toString();
  const ingredients = formData.get('ingredients')?.toString();
  const isBestseller = formData.get('isBestseller') === 'on';

  const imageFiles = formData.getAll('images') as File[];

  if (!title || !sku || !priceStr || !categoryIdStr) {
    throw new Error('Заполните все обязательные поля');
  }

  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const uploadResult = await uploadToR2(file);
      if (!uploadResult.success) throw new Error(`Ошибка загрузки: ${uploadResult.error}`);
      if (uploadResult.url) imageUrls.push(uploadResult.url);
    }
  }

  const price = Math.round(parseFloat(priceStr) * 100);
  const categoryId = parseInt(categoryIdStr, 10);

  const updateData: any = {
    title, sku, price, categoryId,
    description: description || null,
    weightInfo: weightInfo || null,
    ingredients: ingredients || null,
    isBestseller,
  };

  // Если загрузили новые фото — заменяем. Если оставили пустым — старые фото сохранятся
  if (imageUrls.length > 0) {
    updateData.imageUrl = imageUrls.join(',');
  }

  await db.update(products).set(updateData).where(eq(products.id, id));

  // ⚡️ После обновления перебрасываем пользователя обратно в каталог
  redirect('/admin/catalog');
}

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
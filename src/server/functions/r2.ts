import { getRequestContext } from '@cloudflare/next-on-pages';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export async function uploadToR2(
  file: File,
  folder: string = 'products'
): Promise<UploadResult> {
  try {
    const { env } = getRequestContext();

    if (!file || file.size === 0) {
      return { success: false, error: 'Файл не выбран' };
    }

    // Генерируем уникальное имя файла (чтобы избежать конфликтов)
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const key = `${folder}/${timestamp}_${randomId}.${extension}`;

    // Конвертируем картинку в массив байтов для отправки
    const arrayBuffer = await file.arrayBuffer();

    // Отправляем в R2. (env as any) используем, чтобы строгий TypeScript не ругался на новую привязку
    const bucket = (env as any).R2_IMAGES;
    
    if (!bucket) {
      throw new Error("Хранилище R2_IMAGES не привязано к проекту!");
    }

    const result = await bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // Кешируем на год для скорости
      },
      customMetadata: {
        originalName: file.name,
      },
    });

    if (!result) {
      return { success: false, error: 'Cloudflare отклонил файл' };
    }

    // Формируем ту самую ссылку, которую ты мне скинул
    const publicUrl = `https://pub-836bbe909b5140948d4894910cd8b9e4.r2.dev/${key}`;

    return {
      success: true,
      url: publicUrl,
      key: key,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
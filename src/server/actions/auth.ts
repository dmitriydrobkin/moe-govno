'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Хелпер для создания SHA-256 хэша с использованием встроенного Web Crypto API.
 * Работает молниеносно на Edge-платформах без внешних библиотек.
 */
async function generateHash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Логика проверки пароля и создания защищенной сессии.
 */
export async function loginAdmin(formData: FormData) {
  const passwordInput = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Если пароль на хостинге вообще не задан, блокируем вход в целях безопасности
  if (!adminPassword) {
    return { error: 'Критическая ошибка: ADMIN_PASSWORD не настроен на сервере.' };
  }

  // Сравниваем хэши введенного пароля и серверного пароля
  const inputHash = await generateHash(passwordInput);
  const targetHash = await generateHash(adminPassword);

  if (inputHash !== targetHash) {
    return { error: 'Неверный пароль администратора' };
  }

  // Создаем уникальный сессионный токен на основе пароля и секретной соли сервера
  const sessionToken = await generateHash(`${adminPassword}-secret-salt-2026`);

  // Устанавливаем супер-защищенную куку на 7 дней
  cookies().set('admin_session', sessionToken, {
    httpOnly: true, // Защита от кражи через XSS/JS-скрипты
    secure: true,   // Передача только по зашифрованному HTTPS
    sameSite: 'strict', // Защита от CSRF-атак
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  });

  // Перенаправляем в админку
  redirect('/admin');
}

/**
 * Выход из панели управления (очистка кук).
 */
export async function logoutAdmin() {
  cookies().delete('admin_session');
  redirect('/');
}

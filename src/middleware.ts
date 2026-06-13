import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Хелпер для генерации хэша SHA-256 внутри Middleware.
 */
async function generateHash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Если пользователь идет в админку (но не на страницу логина)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Если куки нет или на сервере забыли поставить пароль — тотальный запрет
    if (!sessionCookie || !adminPassword) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Вычисляем, какой хэш должен быть правильным
    const expectedToken = await generateHash(`${adminPassword}-secret-salt-2026`);

    // Если кука подделана или устарела — выкидываем на логин
    if (sessionCookie !== expectedToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Настройка триггера: Мидлвар будет срабатывать только при попытке зайти на /admin
 */
export const config = {
  matcher: ['/admin/:path*'],
};

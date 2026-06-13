'use client';

import { useState } from 'react';
import { loginAdmin } from '@/server/actions/auth';

export const runtime = 'edge';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);

    // Если экшн вернул ошибку, выводим её на экран
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-cream-dark flex items-center justify-center px-6 text-chocolate">
      <div className="w-full max-w-md bg-cream p-10 border border-chocolate/5 shadow-sm text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold mb-2">
          Maison de Pâtisserie
        </p>
        <h1 className="font-serif text-3xl mb-8 font-light">Вход в панель</h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/60 mb-2">
              Ключ доступа
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full border border-chocolate/20 px-4 py-3 bg-transparent font-sans text-sm outline-none transition-colors focus:border-gold text-center tracking-widest"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-500 text-center bg-red-50/50 py-2 border border-red-100">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

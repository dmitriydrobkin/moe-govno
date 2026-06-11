/**
 * Страница оформления заказа (checkout).
 * Серверная оболочка + клиентская форма и сводка заказа.
 */

import Link from 'next/link';
import { CheckoutForm, OrderSummary } from '@/app/checkout/CheckoutForm';

export const runtime = 'edge';

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Заголовок */}
      <div className="mb-12">
        <nav className="mb-6 font-sans text-xs uppercase tracking-widest text-chocolate/40">
          <Link href="/catalog" className="transition-colors duration-300 hover:text-gold">
            Каталог
          </Link>
          <span className="mx-2">/</span>
          <span>Оформление</span>
        </nav>
        <h1 className="section-title">Оформление заказа</h1>
        <p className="section-subtitle">
          Заполните контактные данные — мы свяжемся для подтверждения
        </p>
      </div>

      {/* Двухколоночный layout: форма + сводка */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}

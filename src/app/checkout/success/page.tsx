/**
 * Страница успешного оформления заказа.
 */

import Link from 'next/link';

export const runtime = 'edge';

interface SuccessPageProps {
  searchParams: { orderId?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.orderId;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="animate-fade-in-up">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
          Merci
        </p>
        <h1 className="section-title mt-4">Заказ принят</h1>
        {orderId && (
          <p className="mt-4 font-serif text-xl text-chocolate">
            Номер заказа: <span className="text-gold">№{orderId}</span>
          </p>
        )}
        <p className="section-subtitle mx-auto mt-4">
          Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/catalog" className="btn-primary">
            Продолжить покупки
          </Link>
          <Link href="/" className="btn-outline">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

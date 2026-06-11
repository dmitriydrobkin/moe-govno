/**
 * Клиентская форма оформления заказа с валидацией.
 * Отправляет POST на /api/orders и очищает корзину при успехе.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/format';

/** Поля формы checkout */
interface FormData {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  comment: string;
}

/** Ошибки валидации по полям */
interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    comment: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = getTotalPrice();

  /** Валидация обязательных полей формы */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Введите имя';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Введите телефон';
    } else if (!/^[\d\s+\-()]{10,}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Некорректный формат телефона';
    }
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Введите адрес доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Отправка заказа на Edge API */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError('Корзина пуста');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          deliveryAddress: formData.deliveryAddress.trim(),
          comment: formData.comment.trim() || undefined,
          totalPrice: total,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        orderId?: number;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Ошибка оформления заказа');
      }

      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Имя клиента */}
      <div>
        <label
          htmlFor="customerName"
          className="block font-sans text-xs uppercase tracking-widest text-chocolate/60"
        >
          Имя *
        </label>
        <input
          id="customerName"
          type="text"
          value={formData.customerName}
          onChange={handleChange('customerName')}
          className={`mt-2 w-full border bg-transparent px-4 py-3 font-sans text-sm text-chocolate outline-none transition-colors duration-300 focus:border-gold ${
            errors.customerName ? 'border-red-400' : 'border-chocolate/20'
          }`}
          placeholder="Анна"
        />
        {errors.customerName && (
          <p className="mt-1 font-sans text-xs text-red-500">{errors.customerName}</p>
        )}
      </div>

      {/* Телефон */}
      <div>
        <label
          htmlFor="customerPhone"
          className="block font-sans text-xs uppercase tracking-widest text-chocolate/60"
        >
          Телефон *
        </label>
        <input
          id="customerPhone"
          type="tel"
          value={formData.customerPhone}
          onChange={handleChange('customerPhone')}
          className={`mt-2 w-full border bg-transparent px-4 py-3 font-sans text-sm text-chocolate outline-none transition-colors duration-300 focus:border-gold ${
            errors.customerPhone ? 'border-red-400' : 'border-chocolate/20'
          }`}
          placeholder="+380 XX XXX XX XX"
        />
        {errors.customerPhone && (
          <p className="mt-1 font-sans text-xs text-red-500">{errors.customerPhone}</p>
        )}
      </div>

      {/* Адрес доставки */}
      <div>
        <label
          htmlFor="deliveryAddress"
          className="block font-sans text-xs uppercase tracking-widest text-chocolate/60"
        >
          Адрес доставки *
        </label>
        <input
          id="deliveryAddress"
          type="text"
          value={formData.deliveryAddress}
          onChange={handleChange('deliveryAddress')}
          className={`mt-2 w-full border bg-transparent px-4 py-3 font-sans text-sm text-chocolate outline-none transition-colors duration-300 focus:border-gold ${
            errors.deliveryAddress ? 'border-red-400' : 'border-chocolate/20'
          }`}
          placeholder="г. Киев, ул. Примерная, 1, кв. 10"
        />
        {errors.deliveryAddress && (
          <p className="mt-1 font-sans text-xs text-red-500">{errors.deliveryAddress}</p>
        )}
      </div>

      {/* Комментарий (необязательный) */}
      <div>
        <label
          htmlFor="comment"
          className="block font-sans text-xs uppercase tracking-widest text-chocolate/60"
        >
          Комментарий
        </label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={handleChange('comment')}
          rows={3}
          className="mt-2 w-full resize-none border border-chocolate/20 bg-transparent px-4 py-3 font-sans text-sm text-chocolate outline-none transition-colors duration-300 focus:border-gold"
          placeholder="Пожелания к заказу, время доставки..."
        />
      </div>

      {submitError && (
        <p className="font-sans text-sm text-red-500">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
      </button>
    </form>
  );
}

/** Сводка заказа для правой колонки checkout */
export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  if (items.length === 0) {
    return (
      <div className="border border-chocolate/10 p-8 text-center">
        <p className="font-serif text-lg text-chocolate/60">Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="border border-chocolate/10 p-8">
      <h2 className="font-serif text-2xl font-light text-chocolate">Ваш заказ</h2>
      <div className="divider-gold my-6" />

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4">
            <span className="font-sans text-sm text-chocolate/70">
              {item.title} × {item.quantity}
            </span>
            <span className="font-serif text-sm text-chocolate">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="divider-gold my-6" />

      <div className="flex justify-between">
        <span className="font-sans text-xs uppercase tracking-widest text-chocolate/60">
          Итого
        </span>
        <span className="font-serif text-2xl text-gold">
          {formatPrice(getTotalPrice())}
        </span>
      </div>
    </div>
  );
}

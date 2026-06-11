/**
 * Slide-over панель корзины.
 * Список товаров, изменение количества, итоговая сумма и переход к checkout.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/format';

export function CartSlideOver() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  if (!isOpen) return null;

  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50">
      {/* Затемнённый оверлей */}
      <div
        className="absolute inset-0 bg-chocolate/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Панель справа */}
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl animate-slide-in-right"
        role="dialog"
        aria-label="Корзина"
      >
        {/* Заголовок панели */}
        <div className="flex items-center justify-between border-b border-chocolate/10 px-6 py-5">
          <h2 className="font-serif text-2xl font-light text-chocolate">Корзина</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-chocolate/50 transition-colors duration-300 hover:text-chocolate"
            aria-label="Закрыть корзину"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Список позиций или пустое состояние */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-xl text-chocolate/60">Корзина пуста</p>
              <p className="mt-2 font-sans text-sm text-chocolate/40">
                Добавьте изысканные сладости из каталога
              </p>
              <Link
                href="/catalog"
                onClick={closeCart}
                className="btn-outline mt-8"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 border-b border-chocolate/5 pb-6 last:border-0"
                >
                  {/* Миниатюра товара */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-cream-dark">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base text-chocolate">{item.title}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-chocolate/30 transition-colors duration-300 hover:text-chocolate"
                        aria-label={`Удалить ${item.title}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="mt-1 font-serif text-sm text-gold">
                      {formatPrice(item.price)}
                    </p>

                    {/* Счётчик количества */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center border border-chocolate/20 text-chocolate transition-colors duration-300 hover:border-gold hover:text-gold"
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center border border-chocolate/20 text-chocolate transition-colors duration-300 hover:border-gold hover:text-gold"
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Итог и кнопка оформления */}
        {items.length > 0 && (
          <div className="border-t border-chocolate/10 px-6 py-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-sans text-sm uppercase tracking-widest text-chocolate/60">
                Итого
              </span>
              <span className="font-serif text-2xl text-chocolate">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center"
            >
              Оформить заказ
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

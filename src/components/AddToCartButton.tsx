/**
 * Кнопка «В корзину» для страницы товара.
 * Добавляет позицию в Zustand-store и открывает slide-over.
 */

'use client';

import { useState } from 'react';
import type { Product } from '@/server/db/schema';
import { useCartStore } from '@/store/cart';
import { getProductImageUrl } from '@/lib/format';
import { QuantitySelector } from '@/components/QuantitySelector';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartSection({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;

    addItem(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: getProductImageUrl(product.imageUrl),
      },
      quantity,
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-8 space-y-6">
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added ? 'Добавлено ✓' : product.inStock ? 'В корзину' : 'Нет в наличии'}
      </button>
    </div>
  );
}

/**
 * Селектор количества товара для страницы продукта.
 * Клиентский компонент с локальным state.
 */

'use client';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-sans text-xs uppercase tracking-widest text-chocolate/60">
        Количество
      </span>
      <div className="flex items-center border border-chocolate/20">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          className="flex h-10 w-10 items-center justify-center text-chocolate transition-colors duration-300 hover:bg-gold/10 disabled:opacity-30"
          aria-label="Уменьшить"
        >
          −
        </button>
        <span className="flex h-10 w-12 items-center justify-center border-x border-chocolate/20 font-sans text-sm">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="flex h-10 w-10 items-center justify-center text-chocolate transition-colors duration-300 hover:bg-gold/10 disabled:opacity-30"
          aria-label="Увеличить"
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Утилиты форматирования цен и текста для UI магазина.
 * Совместимы с Edge Runtime — без Node.js API.
 */

/** Форматирование цены в гривнах с разделителями тысяч */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Заглушка изображения, если imageUrl отсутствует в БД */
export function getProductImageUrl(imageUrl: string | null | undefined): string {
  return (
    imageUrl ??
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80'
  );
}

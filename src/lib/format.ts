export function formatPrice(priceInKopecks: number): string {
  // ⚡️ Превращаем копейки обратно в гривны
  const price = priceInKopecks / 100; 

  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    // Если цена без копеек (например 100.00), то нули после запятой не пишем
    minimumFractionDigits: price % 1 === 0 ? 0 : 2, 
    maximumFractionDigits: 2,
  }).format(price);
}

// Утилита для подстраховки пустых картинок
export function getProductImageUrl(url?: string | null): string {
  return url || 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80';
}

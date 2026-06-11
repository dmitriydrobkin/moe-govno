/**
 * Интеграция с Telegram Bot API для уведомлений о новых заказах.
 * Использует стандартный fetch — совместимо с Edge Runtime.
 * Токены берутся из переменных окружения Cloudflare/Next.js.
 */

export const runtime = 'edge';

/** DTO для формирования Telegram-сообщения */
interface TelegramOrderNotification {
  orderId: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
}

/**
 * Отправить уведомление о новом заказе в Telegram через Bot API sendMessage.
 * Если переменные окружения не заданы — тихо пропускаем (dev-режим).
 */
export async function sendTelegramOrderNotification(
  data: TelegramOrderNotification,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      'Telegram: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы — уведомление пропущено',
    );
    return;
  }

  const message =
    `Новый заказ №${data.orderId}! ` +
    `Клиент: ${data.customerName}, ` +
    `Телефон: ${data.customerPhone}. ` +
    `Сумма: ${Math.round(data.totalPrice)} грн.`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', errorText);
    }
  } catch (error) {
    console.error('Telegram fetch error:', error);
  }
}

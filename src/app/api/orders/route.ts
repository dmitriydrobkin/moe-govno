/**
 * Edge API-маршрут создания заказа.
 * Записывает заказ + позиции в D1 и отправляет уведомление в Telegram.
 */

import { z } from 'zod';
import { createOrder } from '@/server/functions/orders';
import { sendTelegramOrderNotification } from '@/server/functions/telegram';

export const runtime = 'edge';

/** Zod-схема валидации тела POST-запроса */
const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Имя обязательно'),
  customerPhone: z.string().min(10, 'Телефон обязателен'),
  deliveryAddress: z.string().min(5, 'Адрес обязателен'),
  comment: z.string().optional(),
  totalPrice: z.number().positive(),
  items: z.array(orderItemSchema).min(1, 'Корзина пуста'),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Невалидные данные' },
        { status: 400 },
      );
    }

    const data = parsed.data;

    /** Пересчитываем сумму на сервере для защиты от подмены */
    const calculatedTotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderId = await createOrder({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      comment: data.comment,
      totalPrice: calculatedTotal,
      items: data.items,
    });

    if (!orderId) {
      return Response.json(
        { success: false, error: 'Не удалось создать заказ' },
        { status: 500 },
      );
    }

    /** Асинхронное уведомление в Telegram — не блокируем ответ клиенту при ошибке */
    await sendTelegramOrderNotification({
      orderId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      totalPrice: calculatedTotal,
    });

    return Response.json({ success: true, orderId });
  } catch (error) {
    console.error('API /orders error:', error);
    return Response.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 },
    );
  }
}

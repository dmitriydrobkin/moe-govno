/**
 * Серверные функции для создания заказов в D1.
 * Используются API-маршрутом checkout (Edge Runtime).
 */

import { db } from '@/server/db';
import { orderItems, orders } from '@/server/db/schema';

export const runtime = 'edge';

/** DTO одной позиции заказа из клиентской корзины */
export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

/** DTO тела POST-запроса оформления заказа */
export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  comment?: string;
  items: CreateOrderItemInput[];
  totalPrice: number;
}

/**
 * Создать заказ и связанные позиции в одной транзакции D1.
 * Возвращает id созданного заказа или null при ошибке.
 */
export async function createOrder(data: CreateOrderInput): Promise<number | null> {
  try {
    const fullAddress = data.comment
      ? `${data.deliveryAddress}\nКомментарий: ${data.comment}`
      : data.deliveryAddress;

    const orderResult = await db
      .insert(orders)
      .values({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryAddress: fullAddress,
        totalPrice: data.totalPrice,
        status: 'pending',
      })
      .returning({ id: orders.id });

    const orderId = orderResult[0]?.id;
    if (!orderId) return null;

    if (data.items.length > 0) {
      await db.insert(orderItems).values(
        data.items.map((item) => ({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      );
    }

    return orderId;
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return null;
  }
}

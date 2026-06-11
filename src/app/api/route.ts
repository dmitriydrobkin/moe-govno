/**
 * API health-check и информация о магазине.
 * Заменяет демо-роут customers из каркаса.
 */

export const runtime = 'edge';

export async function GET() {
  return Response.json({
    name: 'Chocolat. API',
    version: '1.0.0',
    endpoints: {
      orders: 'POST /api/orders',
    },
  });
}

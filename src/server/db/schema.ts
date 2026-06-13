/**
 * Схема базы данных D1 для премиального кондитерского интернет-магазина.
 * Все таблицы описаны через Drizzle ORM (sqlite-core) и совместимы с Edge Runtime.
 */

import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * ТАБЛИЦА НАСТРОЕК: Динамический контент сайта.
 */
export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

/**
 * КОНТЕНТ СТРАНИЦ: Хранение текстов и SEO для каждого маршрута.
 */
export const pageContent = sqliteTable('page_content', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  pageRoute: text('page_route').notNull(),
  key: text('key').notNull(),
  value: text('value').notNull(),
}, (table) => ({
  pageRouteIdx: index('page_content_page_route_idx').on(table.pageRoute),
}));

/**
 * Категории кондитерских изделий.
 */
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(), 
  description: text('description'),
});

/**
 * Товары магазина с привязкой к категории.
 */
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  slug: text('slug').notNull().unique(), // Вернули для красивых URL
  sku: text('sku').unique(), // Артикул
  title: text('title').notNull(),
  price: integer('price').notNull(), // Цена в копейках
  oldPrice: integer('old_price'),
  description: text('description'),
  weightInfo: text('weight_info'),
  ingredients: text('ingredients'),
  imageUrl: text('image_url'),
  status: text('status').notNull().default('in_stock'),
});

/**
 * Заказы клиентов (ВЕРНУЛИ).
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  totalPrice: integer('total_price').notNull(),
  status: text('status').notNull().default('new'), 
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Позиции заказа (ВЕРНУЛИ).
 */
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

/** * Связи Drizzle 
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

/** * Выводимые типы 
 */
export type SiteSetting = typeof siteSettings.$inferSelect;
export type PageContent = typeof pageContent.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

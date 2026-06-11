/**
 * Схема базы данных D1 для премиального кондитерского интернет-магазина.
 * Все таблицы описаны через Drizzle ORM (sqlite-core) и совместимы с Edge Runtime.
 */

import { relations, sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Категории кондитерских изделий (торты, macarons, шоколад и т.д.).
 * slug используется в URL для фильтрации каталога.
 */
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
});

/**
 * Товары магазина с привязкой к категории.
 * is_bestseller и in_stock хранятся как SQLite INTEGER с mode: 'boolean'.
 */
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  price: real('price').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  isBestseller: integer('is_bestseller', { mode: 'boolean' })
    .notNull()
    .default(false),
  inStock: integer('in_stock', { mode: 'boolean' }).notNull().default(true),
});

/**
 * Заказы клиентов с контактными данными и статусом обработки.
 * created_at заполняется автоматически на стороне SQLite.
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Позиции заказа — связь «заказ ↔ товар» с зафиксированной ценой на момент покупки.
 */
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

/** Связи Drizzle для типобезопасных join-запросов */
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

/** Выводимые типы строк таблиц для использования в компонентах и API */
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

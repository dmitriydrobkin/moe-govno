/**
 * Mock-данные для демонстрации интерфейса, когда D1 ещё не заполнена.
 * Используются как fallback в серверных функциях select.
 */

import type { Category, Product } from '@/server/db/schema';

/** Демонстрационные категории кондитерских изделий */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    slug: 'torty',
    title: 'Авторские торты',
    description: 'Многослойные композиции из бельгийского шоколада и свежих ягод',
  },
  {
    id: 2,
    slug: 'macarons',
    title: 'Macarons',
    description: 'Нежные миндальные печенья с изысканными начинками',
  },
  {
    id: 3,
    slug: 'shokolad',
    title: 'Шоколад ручной работы',
    description: 'Tempering 72% какао — глянцевый блеск и глубокий вкус',
  },
  {
    id: 4,
    slug: 'desserty',
    title: 'Пирожные',
    description: 'Миниатюрные десерты для особых моментов',
  },
];

/** Демонстрационные товары с изображениями-заглушками */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 1,
    slug: 'shokoladnyj-velvet',
    sku: null,
    title: 'Шоколадный Velvet',
    price: 1850,
    oldPrice: null, // ⚡️ Добавили недостающее поле
    weightInfo: null, // ⚡️ Добавили недостающее поле
    ingredients: null, // ⚡️ Добавили недостающее поле
    status: 'in_stock', // ⚡️ Добавили недостающее поле
    description:
      'Трёхслойный бисквит с бельгийским какао, кремом mascarpone и глазурью из тёмного шоколада 72%.',
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    isBestseller: true,
    inStock: true,
  },
  {
    id: 2,
    categoryId: 1,
    slug: 'malinovyj-sad',
    sku: null,
    title: 'Малиновый сад',
    price: 2100,
    oldPrice: null,
    weightInfo: null,
    ingredients: null,
    status: 'in_stock',
    description:
      'Лёгкий ванильный бисквит, малиновый confit и крем из свежих ягод.',
    imageUrl:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    isBestseller: true,
    inStock: true,
  },
  {
    id: 3,
    categoryId: 2,
    slug: 'macarons-assorti',
    sku: null,
    title: 'Macarons Assorti',
    price: 680,
    oldPrice: null,
    weightInfo: null,
    ingredients: null,
    status: 'in_stock',
    description: 'Набор из 12 macarons: фисташка, роза, salted caramel, ваниль.',
    imageUrl:
      'https://images.unsplash.com/photo-1569864358642-9d1684040f56?w=800&q=80',
    isBestseller: true,
    inStock: true,
  },
  {
    id: 4,
    categoryId: 3,
    slug: 'trufeli-grand-cru',
    sku: null,
    title: 'Трюфели Grand Cru',
    price: 920,
    oldPrice: null,
    weightInfo: null,
    ingredients: null,
    status: 'in_stock',
    description: '12 трюфелей из single-origin какао с какао-пудрой.',
    imageUrl:
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80',
    isBestseller: false,
    inStock: true,
  },
  {
    id: 5,
    categoryId: 4,
    slug: 'eclair-parizh',
    sku: null,
    title: 'Éclair Paris',
    price: 145,
    oldPrice: null,
    weightInfo: null,
    ingredients: null,
    status: 'in_stock',
    description: 'Классический эклер с заварным кремом и глазурью.',
    imageUrl:
      'https://images.unsplash.com/photo-1612203985729-7072916a065a?w=800&q=80',
    isBestseller: true,
    inStock: true,
  },
  {
    id: 6,
    categoryId: 4,
    slug: 'opera-mini',
    sku: null,
    title: 'Opera Mini',
    price: 320,
    oldPrice: null,
    weightInfo: null,
    ingredients: null,
    status: 'in_stock',
    description: 'Миниатюрная версия легендарного Opera — кофе, шоколад, ganache.',
    imageUrl:
      'https://images.unsplash.com/photo-1488477181941-781016af5f97?w=800&q=80',
    isBestseller: false,
    inStock: true,
  },
];

-- Миграция схемы D1 для премиального кондитерского магазина Chocolat.
-- Применение: pnpm db:migrate:dev (local) / pnpm db:migrate:prod (remote)

CREATE TABLE IF NOT EXISTS `categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `description` text
);

CREATE UNIQUE INDEX IF NOT EXISTS `categories_slug_unique` ON `categories` (`slug`);

CREATE TABLE IF NOT EXISTS `products` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `category_id` integer NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `price` real NOT NULL,
  `description` text,
  `image_url` text,
  `is_bestseller` integer DEFAULT false NOT NULL,
  `in_stock` integer DEFAULT true NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);

CREATE UNIQUE INDEX IF NOT EXISTS `products_slug_unique` ON `products` (`slug`);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `customer_name` text NOT NULL,
  `customer_phone` text NOT NULL,
  `delivery_address` text NOT NULL,
  `total_price` real NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_id` integer NOT NULL,
  `product_id` integer NOT NULL,
  `quantity` integer NOT NULL,
  `price` real NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

-- Начальные данные для dev/prod
INSERT OR IGNORE INTO `categories` (`id`, `slug`, `title`, `description`) VALUES
  (1, 'torty', 'Авторские торты', 'Многослойные композиции из бельгийского шоколада и свежих ягод'),
  (2, 'macarons', 'Macarons', 'Нежные миндальные печенья с изысканными начинками'),
  (3, 'shokolad', 'Шоколад ручной работы', 'Tempering 72% какао — глянцевый блеск и глубокий вкус'),
  (4, 'desserty', 'Пирожные', 'Миниатюрные десерты для особых моментов');

INSERT OR IGNORE INTO `products` (`id`, `category_id`, `slug`, `title`, `price`, `description`, `image_url`, `is_bestseller`, `in_stock`) VALUES
  (1, 1, 'shokoladnyj-velvet', 'Шоколадный Velvet', 1850, 'Трёхслойный бисквит с бельгийским какао, кремом mascarpone и глазурью из тёмного шоколада 72%.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', 1, 1),
  (2, 1, 'malinovyj-sad', 'Малиновый сад', 2100, 'Лёгкий ванильный бисквит, малиновый confit и крем из свежих ягод.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', 1, 1),
  (3, 2, 'macarons-assorti', 'Macarons Assorti', 680, 'Набор из 12 macarons: фисташка, роза, salted caramel, ваниль.', 'https://images.unsplash.com/photo-1569864358642-9d1684040f56?w=800&q=80', 1, 1),
  (4, 3, 'trufeli-grand-cru', 'Трюфели Grand Cru', 920, '12 трюфелей из single-origin какао с какао-пудрой.', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80', 0, 1),
  (5, 4, 'eclair-parizh', 'Éclair Paris', 145, 'Классический эклер с заварным кремом и глазурью.', 'https://images.unsplash.com/photo-1612203985729-7072916a065a?w=800&q=80', 1, 1),
  (6, 4, 'opera-mini', 'Opera Mini', 320, 'Миниатюрная версия легендарного Opera — кофе, шоколад, ganache.', 'https://images.unsplash.com/photo-1488477181941-781016af5f97?w=800&q=80', 0, 1);

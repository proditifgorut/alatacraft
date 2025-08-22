-- Skema Database untuk Marketplace Alatacraft
-- Versi: 1.0
-- Dialek: MySQL / MariaDB

-- Menonaktifkan pengecekan foreign key sementara untuk menghindari error saat drop table
SET FOREIGN_KEY_CHECKS=0;

-- Hapus tabel jika sudah ada untuk instalasi ulang yang bersih
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- Mengaktifkan kembali pengecekan foreign key
SET FOREIGN_KEY_CHECKS=1;

-- 1. Tabel Pengguna (users)
-- Menyimpan data semua pengguna, baik pembeli, pengrajin, maupun admin.
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('pembeli', 'pengrajin', 'admin') NOT NULL DEFAULT 'pembeli',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Kategori (categories)
-- Menyimpan kategori produk kerajinan.
CREATE TABLE `categories` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(120) NOT NULL UNIQUE COMMENT 'Untuk URL friendly',
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Produk (products)
-- Menyimpan semua data produk yang dijual oleh pengrajin.
CREATE TABLE `products` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Gambar Produk (product_images)
-- Menyimpan URL gambar untuk setiap produk (satu produk bisa punya banyak gambar).
CREATE TABLE `product_images` (
  `image_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(2048) NOT NULL,
  `alt_text` VARCHAR(255),
  `is_featured` BOOLEAN DEFAULT FALSE COMMENT 'Tandai sebagai gambar utama produk',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Pesanan (orders)
-- Menyimpan informasi header dari setiap transaksi.
CREATE TABLE `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `buyer_id` INT NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('menunggu pembayaran', 'diproses', 'dikirim', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'menunggu pembayaran',
  `shipping_address` TEXT NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Detail Pesanan (order_details)
-- Menyimpan item-item produk dalam setiap pesanan.
CREATE TABLE `order_details` (
  `order_detail_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price_at_purchase` DECIMAL(12, 2) NOT NULL COMMENT 'Harga produk saat dibeli',
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel Pembayaran (payments)
-- Menyimpan catatan setiap upaya pembayaran yang terkait dengan pesanan.
CREATE TABLE `payments` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `method` VARCHAR(50) NOT NULL COMMENT 'Contoh: QRIS, Bank Transfer',
  `status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
  `transaction_code` VARCHAR(255) COMMENT 'ID transaksi dari payment gateway',
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contoh data untuk tabel Kategori
INSERT INTO `categories` (`category_name`, `slug`, `description`) VALUES
('Keranjang', 'keranjang', 'Berbagai macam keranjang serbaguna dari eceng gondok.'),
('Dekorasi', 'dekorasi', 'Hiasan dinding, pot, dan item dekoratif lainnya.'),
('Tas', 'tas', 'Tas jinjing, tas selempang, dan clutch fashion.'),
('Alas Makan', 'alas-makan', 'Alas piring dan tatakan gelas untuk meja makan yang estetik.'),
('Topi', 'topi', 'Topi pantai dan topi fashion dari anyaman eceng gondok.');

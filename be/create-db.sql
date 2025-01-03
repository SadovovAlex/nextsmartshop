
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дамп структуры базы данных products
CREATE DATABASE IF NOT EXISTS "products";
;

-- Дамп структуры для таблица products.products
CREATE TABLE IF NOT EXISTS products (
    "_id" INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    isNew BOOLEAN,
    oldPrice REAL,
    price REAL,
    type TEXT,
    description TEXT,
    category TEXT,
    image TEXT,
    rating INTEGER,
    quantity INTEGER,
    ingredients TEXT
  , "position" INTEGER NULL);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица products.products_audit
CREATE TABLE IF NOT EXISTS products_audit (
    audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    old_title TEXT,
    new_title TEXT,
    old_isNew TINYINT,
    new_isNew TINYINT,
    old_oldPrice REAL,
    new_oldPrice REAL,
    old_price REAL,
    new_price REAL,
    old_type TEXT,
    new_type TEXT,
    old_description TEXT,
    new_description TEXT,
    old_category TEXT,
    new_category TEXT,
    old_image TEXT,
    new_image TEXT,
    old_rating INTEGER,
    new_rating INTEGER,
    old_quantity INTEGER,
    new_quantity INTEGER,
    old_ingredients TEXT,
    new_ingredients TEXT,
    change_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Экспортируемые данные не выделены.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

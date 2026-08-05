// be/database.js
const sqlite3 = require('better-sqlite3');
const path = require('path');

const db = sqlite3(path.join(__dirname, 'products.db'));

// Включаем поддержку внешних ключей
db.pragma('foreign_keys = ON');

try {
  // Создаем таблицу продуктов (с полями hide, created_at, updated_at)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category_id INTEGER,
      isNew INTEGER DEFAULT 0,
      oldPrice REAL DEFAULT 0,
      price REAL DEFAULT 0,
      type TEXT,
      description TEXT,
      image TEXT,
      rating REAL DEFAULT 0,
      quantity INTEGER DEFAULT 0,
      ingredients TEXT,
      hide INTEGER DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES dict_category(id)
    )
  `);

  // Проверяем и добавляем поля если их нет (без DEFAULT)
  const tableInfo = db.prepare("PRAGMA table_info(products)").all();
  const columnNames = tableInfo.map(col => col.name);

  // Добавляем hide если нет
  if (!columnNames.includes('hide')) {
    console.log('📦 Добавление поля hide...');
    db.exec(`ALTER TABLE products ADD COLUMN hide INTEGER DEFAULT NULL`);
  }

  // Добавляем created_at если нет (без DEFAULT, потом обновим)
  if (!columnNames.includes('created_at')) {
    console.log('📦 Добавление поля created_at...');
    db.exec(`ALTER TABLE products ADD COLUMN created_at DATETIME`);
    // Обновляем существующие записи
    db.exec(`UPDATE products SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL`);
  }

  // Добавляем updated_at если нет (без DEFAULT, потом обновим)
  if (!columnNames.includes('updated_at')) {
    console.log('📦 Добавление поля updated_at...');
    db.exec(`ALTER TABLE products ADD COLUMN updated_at DATETIME`);
    // Обновляем существующие записи
    db.exec(`UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL`);
  }

  // Добавляем position если нужно
  if (!columnNames.includes('position')) {
    console.log('📦 Добавление поля position...');
    db.exec(`ALTER TABLE products ADD COLUMN position INTEGER DEFAULT 0`);
  }

  // Таблица категорий
  db.exec(`
    CREATE TABLE IF NOT EXISTS dict_category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_name TEXT NOT NULL,
      cat_priority INTEGER DEFAULT 0
    )
  `);

  // Таблица администраторов
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Подключение к базе данных успешно.');
  console.log('📋 Таблицы проверены/созданы');
} catch (err) {
  console.error('❌ Ошибка открытия базы данных:', err.message);
  process.exit(1);
}

module.exports = db;
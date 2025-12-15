const sqlite3 = require('better-sqlite3');
const path = require('path');

// Создаем или открываем базу данных
const db = sqlite3(path.join(__dirname, 'products.db'));

// Создаем таблицу, если она не существует
try {
  db.exec(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  )`);
  console.log('Подключение к базе данных успешно.');
} catch (err) {
  console.error('Ошибка открытия базы данных:', err.message);
}

module.exports = db;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Создаем или открываем базу данных
const db = new sqlite3.Database(path.join(__dirname, 'products.db'), (err) => {
  if (err) {
    console.error('Ошибка открытия базы данных:', err.message);
  } else {
    console.log('Подключение к базе данных успешно.');
  }
});

// Создаем таблицу, если она не существует
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
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
});

module.exports = db;

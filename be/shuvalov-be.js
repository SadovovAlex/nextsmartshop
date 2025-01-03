const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Настройка CORS
app.use(cors({
  origin: '*', // Разрешить только этот источник
  methods: ['GET', 'POST'], // Разрешенные методы
  allowedHeaders: ['Content-Type'], // Разрешенные заголовки
  credentials: true // Разрешить отправку учетных данных
}));

const db = require('./database');

// Middleware для парсинга JSON
app.use(express.json());

// Метод для получения списка товаров
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY image desc, category desc', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения данных' });
    }
    res.json(rows);
  });
});

// Метод для получения тренд товаров
app.get('/api/trendproducts', (req, res) => {
  db.all('SELECT * FROM products WHERE isNew=1', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения данных' });
    }
    res.json(rows);
  });
});

// Метод для получения одного товара по ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id; // Получаем ID из параметров запроса
  db.get('SELECT * FROM products WHERE _id = ?', [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения данных' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    res.json(row);
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Настройка CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
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
  const productId = req.params.id;
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

// Метод для отправки письма
app.post('/api/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const emailLogin = process.env.EMAIL_LOGIN;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailLogin || !emailPassword) {
    return res.status(500).json({ message: 'Почта не настроена' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailLogin,
      pass: emailPassword
    }
  });

  const mailOptions = {
    from: emailLogin,
    to: email,
    subject: 'New message from your website',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

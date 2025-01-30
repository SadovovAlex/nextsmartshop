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

//DON`t FRGET change data structure in type.ts FrontEnd!!!

// Метод для получения списка товаров
app.get('/api/products', (req, res) => {
  db.all('SELECT p.*, c.cat_name, c.cat_priority FROM products p,  dict_category c WHERE p.category_id = c.id ORDER BY c.cat_priority ASC, title, image DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения данных' });
    }
    res.json(rows);
  });
});

// Метод для получения тренд товаров
app.get('/api/trendproducts', (req, res) => {
  db.all('SELECT p.*, c.cat_name, c.cat_priority FROM products p,  dict_category c WHERE p.category_id = c.id AND isNew=1', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения данных' });
    }
    res.json(rows);
  });
});

// Метод для получения одного товара по ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.get('SELECT p.*, c.cat_name, c.cat_priority FROM products p,  dict_category c WHERE p.category_id = c.id AND _id = ?', [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка получения данных' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    res.json(row);
  });
});

app.post('/api/send-email', (req, res) => {
  const { name, email, message, table, tablestyle } = req.body;

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
    subject: `Новый заказ от ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
    html: `
      <html>
        <head>
          ${tablestyle}
        </head>
        <body>
          <h2>Новый заказ от ${name}</h2>
          <BR>Email: ${email}
          <BR>Сообщение к заказу: ${message}
          <BR>
          <h2>Информация о заказе:</h2>
          ${table}
        </body>
      </html>
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
  console.log(`email:${process.env.EMAIL_LOGIN}`);


});

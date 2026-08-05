// be/shuvalov-be.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const adminRoutes = require('./admin-login');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== НАСТРОЙКА CORS =====
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://localhost:3002',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== ЛОГИРОВАНИЕ =====
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  if (req.method === 'POST' && req.url !== '/api/auth/login') {
    console.log('📦 Body:', req.body);
  }
  next();
});

// ===== ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ =====
const db = require('./database');

// ===== МАРШРУТЫ АДМИНИСТРАТОРА =====
app.use('/api/auth', adminRoutes);
app.use('/api/admin', adminRoutes);

// ===== МАРШРУТ ДЛЯ ПОЛУЧЕНИЯ КАТЕГОРИЙ =====
app.get('/api/categories', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM dict_category ORDER BY cat_priority ASC, cat_name');
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error('❌ Ошибка получения категорий:', err);
    return res.status(500).json({ 
      message: 'Ошибка получения категорий',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ПОЛУЧЕНИЯ ТОВАРОВ =====
app.get('/api/products', (req, res) => {
  try {
    // Проверяем токен админа
    const token = req.headers.authorization?.split(' ')[1];
    let isAdmin = false;
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jwt.verify(token, JWT_SECRET);
        isAdmin = true;
      } catch (err) {
        // Токен недействителен - просто игнорируем
      }
    }
    
    let stmt;
    if (isAdmin) {
      // Админ видит все товары
      stmt = db.prepare(`
        SELECT p.*, c.cat_name, c.cat_priority 
        FROM products p 
        LEFT JOIN dict_category c ON p.category_id = c.id 
        ORDER BY c.cat_priority ASC, p.title, p.image DESC
      `);
    } else {
      // Обычный пользователь видит только не скрытые
      stmt = db.prepare(`
        SELECT p.*, c.cat_name, c.cat_priority 
        FROM products p 
        LEFT JOIN dict_category c ON p.category_id = c.id 
        WHERE p.hide IS NULL OR p.hide = 0
        ORDER BY c.cat_priority ASC, p.title, p.image DESC
      `);
    }
    
    const rows = stmt.all();
    
    const products = rows.map(row => ({
      _id: row._id,
      title: row.title || '',
      isNew: row.isNew || 0,
      oldPrice: row.oldPrice || 0,
      price: row.price || 0,
      type: row.type || '',
      description: row.description || '',
      cat_name: row.cat_name || '',
      image: row.image || '',
      rating: row.rating || 0,
      quantity: row.quantity || 0,
      ingredients: row.ingredients || '',
      cat_priority: row.cat_priority || 0,
      hide: row.hide || 0,
    }));
    
    res.json(products);
  } catch (err) {
    console.error('❌ Ошибка получения товаров:', err);
    return res.status(500).json({ 
      message: 'Ошибка получения данных',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ТРЕНДОВЫХ ТОВАРОВ =====
app.get('/api/trendproducts', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT p.*, c.cat_name, c.cat_priority 
      FROM products p 
      LEFT JOIN dict_category c ON p.category_id = c.id 
      WHERE p.isNew = 1 
        AND (p.hide IS NULL OR p.hide = 0)
      ORDER BY c.cat_priority ASC, p.title
    `);
    const rows = stmt.all();
    
    const products = rows.map(row => ({
      _id: row._id,
      title: row.title || '',
      isNew: row.isNew || 0,
      oldPrice: row.oldPrice || 0,
      price: row.price || 0,
      type: row.type || '',
      description: row.description || '',
      cat_name: row.cat_name || '',
      image: row.image || '',
      rating: row.rating || 0,
      quantity: row.quantity || 0,
      ingredients: row.ingredients || '',
      cat_priority: row.cat_priority || 0,
      hide: row.hide || 0,
    }));
    
    res.json(products);
  } catch (err) {
    console.error('❌ Ошибка получения трендов:', err);
    return res.status(500).json({ 
      message: 'Ошибка получения данных',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ПОЛУЧЕНИЯ ОДНОГО ТОВАРА =====
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: 'Неверный ID товара' });
    }
    
    // Проверяем токен админа
    const token = req.headers.authorization?.split(' ')[1];
    let isAdmin = false;
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jwt.verify(token, JWT_SECRET);
        isAdmin = true;
      } catch (err) {
        // Токен недействителен - просто игнорируем
      }
    }
    
    let stmt;
    if (isAdmin) {
      // Админ видит любой товар
      stmt = db.prepare(`
        SELECT p.*, c.cat_name, c.cat_priority 
        FROM products p 
        LEFT JOIN dict_category c ON p.category_id = c.id 
        WHERE p._id = ?
      `);
    } else {
      // Обычный пользователь видит только не скрытый товар
      stmt = db.prepare(`
        SELECT p.*, c.cat_name, c.cat_priority 
        FROM products p 
        LEFT JOIN dict_category c ON p.category_id = c.id 
        WHERE p._id = ?
          AND (p.hide IS NULL OR p.hide = 0)
      `);
    }
    
    const row = stmt.get(productId);
    
    if (!row) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    
    const product = {
      _id: row._id,
      title: row.title || '',
      isNew: row.isNew || 0,
      oldPrice: row.oldPrice || 0,
      price: row.price || 0,
      type: row.type || '',
      description: row.description || '',
      cat_name: row.cat_name || '',
      image: row.image || '',
      rating: row.rating || 0,
      quantity: row.quantity || 0,
      ingredients: row.ingredients || '',
      cat_priority: row.cat_priority || 0,
      hide: row.hide || 0,
    };
    
    res.json(product);
  } catch (err) {
    console.error('❌ Ошибка получения товара:', err);
    return res.status(500).json({ 
      message: 'Ошибка получения данных',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ОБНОВЛЕНИЯ СТАТУСА hide ТОВАРА (админ) =====
app.put('/api/products/:id/hide', (req, res) => {
  try {
    const productId = req.params.id;
    const { hide } = req.body;
    
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: 'Неверный ID товара' });
    }
    
    // Проверяем токен
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Недействительный токен' });
      }

      const hideValue = hide === 1 ? 1 : 0;
      
      const stmt = db.prepare(`
        UPDATE products 
        SET hide = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE _id = ?
      `);
      const result = stmt.run(hideValue, productId);
      
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }
      
      res.json({ 
        message: `Продукт ${hideValue === 1 ? 'скрыт' : 'показан'}`,
        id: productId,
        hide: hideValue
      });
    });
  } catch (err) {
    console.error('❌ Ошибка обновления статуса товара:', err);
    return res.status(500).json({ 
      message: 'Ошибка обновления данных',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ОБНОВЛЕНИЯ ТОВАРА (админ) =====
app.put('/api/admin/products/:id', (req, res) => {
  try {
    const productId = req.params.id;
    const { 
      title, 
      category_id, 
      isNew, 
      oldPrice, 
      price, 
      type, 
      description, 
      image, 
      rating, 
      quantity, 
      ingredients,
      hide 
    } = req.body;

    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: 'Неверный ID товара' });
    }

    // Проверяем токен
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Недействительный токен' });
      }

      // Строим запрос на обновление
      const updates = [];
      const params = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (category_id !== undefined) {
        updates.push('category_id = ?');
        params.push(category_id);
      }
      if (isNew !== undefined) {
        updates.push('isNew = ?');
        params.push(isNew);
      }
      if (oldPrice !== undefined) {
        updates.push('oldPrice = ?');
        params.push(oldPrice);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        params.push(price);
      }
      if (type !== undefined) {
        updates.push('type = ?');
        params.push(type);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      if (image !== undefined) {
        updates.push('image = ?');
        params.push(image);
      }
      if (rating !== undefined) {
        updates.push('rating = ?');
        params.push(rating);
      }
      if (quantity !== undefined) {
        updates.push('quantity = ?');
        params.push(quantity);
      }
      if (ingredients !== undefined) {
        updates.push('ingredients = ?');
        params.push(ingredients);
      }
      if (hide !== undefined) {
        updates.push('hide = ?');
        params.push(hide);
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: 'Нет данных для обновления' });
      }

      // Но для SQLite правильнее использовать:
      updates.push("updated_at = datetime('now')");
      params.push(productId);

      const query = `UPDATE products SET ${updates.join(', ')} WHERE _id = ?`;
      const stmt = db.prepare(query);
      const result = stmt.run(...params);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }

      // Получаем обновленный продукт
      const getStmt = db.prepare(`
        SELECT p.*, c.cat_name, c.cat_priority 
        FROM products p 
        LEFT JOIN dict_category c ON p.category_id = c.id 
        WHERE p._id = ?
      `);
      const updatedProduct = getStmt.get(productId);

      res.json({
        message: 'Товар успешно обновлен',
        product: updatedProduct
      });
    });
  } catch (err) {
    console.error('❌ Ошибка обновления товара:', err);
    return res.status(500).json({ 
      message: 'Ошибка обновления данных',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ УДАЛЕНИЯ ТОВАРА (админ) =====
app.delete('/api/admin/products/:id', (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: 'Неверный ID товара' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Недействительный токен' });
      }

      const stmt = db.prepare('DELETE FROM products WHERE _id = ?');
      const result = stmt.run(productId);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }

      res.json({ 
        message: 'Товар успешно удален',
        id: productId
      });
    });
  } catch (err) {
    console.error('❌ Ошибка удаления товара:', err);
    return res.status(500).json({ 
      message: 'Ошибка удаления товара',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ПОЛУЧЕНИЯ ВСЕХ ТОВАРОВ (включая скрытые) - ТОЛЬКО ДЛЯ АДМИНА =====
app.get('/api/admin/products/all', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Недействительный токен' });
      }
      
      const stmt = db.prepare(`
        SELECT p.*, c.cat_name, c.cat_priority 
        FROM products p 
        LEFT JOIN dict_category c ON p.category_id = c.id 
        ORDER BY p.hide ASC, c.cat_priority ASC, p.title
      `);
      const rows = stmt.all();
      
      const products = rows.map(row => ({
        _id: row._id,
        title: row.title || '',
        isNew: row.isNew || 0,
        oldPrice: row.oldPrice || 0,
        price: row.price || 0,
        type: row.type || '',
        description: row.description || '',
        cat_name: row.cat_name || '',
        image: row.image || '',
        rating: row.rating || 0,
        quantity: row.quantity || 0,
        ingredients: row.ingredients || '',
        cat_priority: row.cat_priority || 0,
        hide: row.hide || 0,
      }));
      
      res.json(products);
    });
  } catch (err) {
    console.error('❌ Ошибка получения всех товаров:', err);
    return res.status(500).json({ 
      message: 'Ошибка получения данных',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ===== МАРШРУТ ДЛЯ ОТПРАВКИ EMAIL =====
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message, table, tablestyle } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Не все обязательные поля заполнены' 
      });
    }

    const emailLogin = process.env.EMAIL_LOGIN;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailLogin || !emailPassword) {
      console.error('❌ Почта не настроена');
      return res.status(500).json({ 
        message: 'Почта не настроена. Обратитесь к администратору.' 
      });
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
      from: `"Рязанская молочная ферма" <${emailLogin}>`,
      to: emailLogin,
      replyTo: email,
      subject: `🛒 Новый заказ от ${name}`,
      html: `
        <html>
          <head>${tablestyle || ''}</head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f97316;">🛒 Новый заказ</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Имя:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Сообщение:</strong> ${message}</p>
            </div>
            ${table ? `<h3>📋 Детали заказа:</h3>${table}` : ''}
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Письмо отправлено');
    
    res.status(200).json({ 
      message: 'Заказ успешно отправлен!' 
    });

  } catch (error) {
    console.error('❌ Ошибка отправки email:', error);
    res.status(500).json({ 
      message: 'Ошибка отправки заказа. Попробуйте позже.' 
    });
  }
});

// ===== МАРШРУТ ДЛЯ ПРОВЕРКИ СТАТУСА =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Сервер работает',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===== ОБРАБОТКА 404 =====
app.use((req, res) => {
  res.status(404).json({
    message: `Маршрут ${req.url} не найден`
  });
});

// ===== ОБРАБОТКА ОШИБОК =====
app.use((err, req, res, next) => {
  console.error('❌ Необработанная ошибка:', err);
  res.status(500).json({
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(PORT, () => {
  console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Аутентификация: http://localhost:${PORT}/api/auth/login`);
  console.log(`🛒 Товары: http://localhost:${PORT}/api/products`);
  console.log(`📂 Категории: http://localhost:${PORT}/api/categories`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📧 Email: ${process.env.EMAIL_LOGIN || 'не настроен'}`);
  console.log(`🗄️  База данных: products.db`);
  console.log(`🌍 Режим: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
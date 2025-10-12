const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware для проверки существования таблицы admin_users
const ensureAdminTableExists = (req, res, next) => {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'", (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка базы данных' });
    }
    if (!row) {
      return res.status(500).json({ message: 'Таблица администраторов не создана' });
    }
    next();
  });
};

// Регистрация нового администратора (для первоначальной настройки)
router.post('/register', ensureAdminTableExists, async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Логин и пароль обязательны' });
    }

    // Проверка, существует ли уже пользователь
    db.get('SELECT id FROM admin_users WHERE username = ?', [username], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка базы данных' });
      }

      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
      }

      // Хеширование пароля
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Создание нового администратора
      db.run(
        'INSERT INTO admin_users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Ошибка создания пользователя' });
          }

          // Создание JWT токена
          const token = jwt.sign(
            { 
              userId: this.lastID, 
              username, 
              role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.json({
            message: 'Администратор успешно создан',
            user: { 
              id: this.lastID, 
              username, 
              role 
            },
            token
          });
        }
      );
    });
  } catch (error) {
    console.error('Ошибка при регистрации администратора:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Вход администратора
router.post('/login', ensureAdminTableExists, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Логин и пароль обязательны' });
    }

    // Поиск администратора в базе данных
    db.get('SELECT id, username, password, role FROM admin_users WHERE username = ?', [username], async (err, admin) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка базы данных' });
      }

      if (!admin) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      // Создание JWT токена
      const token = jwt.sign(
        { 
          userId: admin.id, 
          username: admin.username, 
          role: admin.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Успешный вход',
        user: { 
          id: admin.id, 
          username: admin.username, 
          role: admin.role 
        },
        token
      });
    });
  } catch (error) {
    console.error('Ошибка при входе администратора:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Проверка токена (защищенный маршрут)
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    res.json({
      user: decoded
    });
  });
});

module.exports = router;
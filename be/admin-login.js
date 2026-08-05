// be/admin-login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ===== РАЗРЕШАЕМ CORS =====
const allowCors = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

router.use(allowCors);

// ===== ИНИЦИАЛИЗАЦИЯ ДЕФОЛТНОГО АДМИНИСТРАТОРА =====
const initDefaultAdmin = () => {
  try {
    // Проверяем, есть ли администраторы
    const row = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
    
    if (row.count === 0) {
      const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
      
      const stmt = db.prepare(
        'INSERT INTO admin_users (username, password, role) VALUES (?, ?, ?)'
      );
      stmt.run(defaultUsername, hashedPassword, 'admin');
      
      console.log(`✅ Дефолтный администратор создан: ${defaultUsername} / ${defaultPassword}`);
      return true;
    }
    
    console.log('✅ Администратор уже существует');
    return true;
  } catch (err) {
    console.error('❌ Ошибка инициализации администратора:', err.message);
    return false;
  }
};

// Инициализация при запуске
initDefaultAdmin();

// ===== ВХОД АДМИНИСТРАТОРА =====
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('📝 Попытка входа:', username);

    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Логин и пароль обязательны' 
      });
    }

    // Поиск администратора в базе данных
    const stmt = db.prepare(
      'SELECT id, username, password, role FROM admin_users WHERE username = ?'
    );
    const admin = stmt.get(username);

    if (!admin) {
      console.log('❌ Пользователь не найден:', username);
      return res.status(401).json({ 
        message: 'Неверный логин или пароль' 
      });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('❌ Неверный пароль для:', username);
      return res.status(401).json({ 
        message: 'Неверный логин или пароль' 
      });
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

    console.log('✅ Успешный вход:', username);

    res.json({
      message: 'Успешный вход',
      user: { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role 
      },
      token
    });

  } catch (error) {
    console.error('❌ Ошибка при входе:', error);
    res.status(500).json({ 
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== РЕГИСТРАЦИЯ НОВОГО АДМИНИСТРАТОРА =====
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Логин и пароль обязательны' 
      });
    }

    // Проверка существующего пользователя
    const checkStmt = db.prepare('SELECT id FROM admin_users WHERE username = ?');
    const existingUser = checkStmt.get(username);

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким логином уже существует' 
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание администратора
    const stmt = db.prepare(
      'INSERT INTO admin_users (username, password, role) VALUES (?, ?, ?)'
    );
    const result = stmt.run(username, hashedPassword, role);

    const token = jwt.sign(
      { 
        userId: result.lastInsertRowid, 
        username, 
        role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Администратор успешно создан',
      user: { 
        id: result.lastInsertRowid, 
        username, 
        role 
      },
      token
    });

  } catch (error) {
    console.error('❌ Ошибка при регистрации:', error);
    res.status(500).json({ 
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== ПРОВЕРКА ТОКЕНА =====
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Токен не предоставлен' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        message: 'Недействительный токен',
        error: err.message 
      });
    }

    res.json({
      user: decoded,
      valid: true
    });
  });
});

// ===== ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ТЕКУЩЕМ ПОЛЬЗОВАТЕЛЕ =====
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Токен не предоставлен' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        message: 'Недействительный токен' 
      });
    }

    const stmt = db.prepare(
      'SELECT id, username, role, created_at FROM admin_users WHERE id = ?'
    );
    const admin = stmt.get(decoded.userId);

    if (!admin) {
      return res.status(404).json({ 
        message: 'Пользователь не найден' 
      });
    }

    res.json({
      user: admin
    });
  });
});

// ===== СПИСОК ВСЕХ АДМИНИСТРАТОРОВ =====
router.get('/admins', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    // Проверка прав
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const stmt = db.prepare(
      'SELECT id, username, role, created_at FROM admin_users ORDER BY id'
    );
    const admins = stmt.all();

    res.json({ admins });
  });
});

module.exports = router;
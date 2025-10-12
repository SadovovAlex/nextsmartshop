const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Создаем или открываем базу данных
const db = new sqlite3.Database(path.join(__dirname, 'products.db'), (err) => {
  if (err) {
    console.error('Ошибка открытия базы данных:', err.message);
  } else {
    console.log('Подключение к базе данных успешно.');
  }
});

// Хеширование пароля для тестового администратора
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Инициализация таблицы администраторов
const initAdminTable = async () => {
  try {
    // Создание таблицы
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });

    // Создание триггера для обновления времени обновления
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_admin_users_updated_at 
          AFTER UPDATE ON admin_users
          FOR EACH ROW
        BEGIN
          UPDATE admin_users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });

    // Хеширование пароля
    const hashedPassword = await hashPassword('admin123');

    // Вставка тестового администратора
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO admin_users (username, password, role) 
        VALUES (?, ?, ?)
      `, ['admin', hashedPassword, 'admin'], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Администратор ${this.changes > 0 ? 'создан' : 'уже существует'}: admin / admin123`);
          resolve(null);
        }
      });
    });

    console.log('Таблица администраторов успешно инициализирована');
  } catch (error) {
    console.error('Ошибка при инициализации таблицы администраторов:', error);
  } finally {
    db.close();
  }
};

initAdminTable();
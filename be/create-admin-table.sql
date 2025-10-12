-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Создание триггера для обновления времени обновления
CREATE TRIGGER IF NOT EXISTS update_admin_users_updated_at 
    AFTER UPDATE ON admin_users
    FOR EACH ROW
BEGIN
    UPDATE admin_users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Вставка тестового администратора (пароль: admin123)
-- В реальном приложении этот пароль должен быть изменен
INSERT OR IGNORE INTO admin_users (username, password, role) VALUES 
('admin', '$2a$10$rOZXp5J8Y7Q6K8L9M0N1UO8P9Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D', 'admin');
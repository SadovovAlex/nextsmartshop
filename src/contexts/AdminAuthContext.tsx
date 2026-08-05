// src/contexts/AdminAuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  username: string;
  role?: string;
  id?: number;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  loginError: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Получаем URL API из переменных окружения
  const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return apiUrl.replace(/\/api$/, '');
  };

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedAdmin = localStorage.getItem('adminUser');
        const token = localStorage.getItem('adminToken');
        
        if (savedAdmin && token) {
          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/api/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.valid) {
              setAdmin(JSON.parse(savedAdmin));
            } else {
              localStorage.removeItem('adminUser');
              localStorage.removeItem('adminToken');
            }
          } else {
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    setLoginError(null);
    setIsLoading(true);

    try {
      // Валидация
      if (!credentials.username?.trim() || !credentials.password?.trim()) {
        throw new Error('Пожалуйста, заполните все поля');
      }

      const apiUrl = getApiUrl();
      const loginUrl = `${apiUrl}/api/auth/login`;
      
      console.log('📤 Отправка запроса на:', loginUrl);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password.trim(),
        }),
      });

      console.log('📥 Статус ответа:', response.status);

      // Парсим ответ
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Сервер вернул ошибку: ${response.status} ${text}`);
      }

      // Обработка ошибок HTTP
      if (!response.ok) {
        // Извлекаем сообщение об ошибке из ответа
        const errorMessage = data?.message || data?.error || 'Ошибка входа';
        
        // Специфичные сообщения для разных кодов ошибок
        if (response.status === 401) {
          throw new Error('Неверный логин или пароль. Проверьте введенные данные.');
        } else if (response.status === 400) {
          throw new Error(errorMessage || 'Неверный запрос. Проверьте введенные данные.');
        } else if (response.status === 500) {
          throw new Error('Ошибка сервера. Попробуйте позже.');
        } else {
          throw new Error(errorMessage);
        }
      }

      // Успешный вход
      if (data?.user) {
        const userData = {
          username: data.user.username,
          role: data.user.role || 'admin',
          id: data.user.id,
        };
        
        setAdmin(userData);
        
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        setLoginError(null);
        console.log('✅ Успешный вход пользователя:', userData.username);
      } else {
        throw new Error('Неверный формат ответа от сервера');
      }

    } catch (error: any) {
      // Логируем ошибку для разработчика
      console.error('❌ Ошибка входа:', error.message);
      
      // Устанавливаем понятное сообщение для пользователя
      let userMessage = error.message || 'Произошла ошибка при входе';
      
      // Дополнительная обработка для сетевых ошибок
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        userMessage = 'Не удалось подключиться к серверу. Проверьте интернет-соединение.';
      } else if (error.message.includes('JSON')) {
        userMessage = 'Ошибка формата данных от сервера. Попробуйте позже.';
      }
      
      setLoginError(userMessage);
      
      // Пробрасываем ошибку дальше для компонента
      throw new Error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setLoginError(null);
    console.log('👋 Пользователь вышел');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout, loginError }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
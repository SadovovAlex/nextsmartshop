// src/components/AdminLoginForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  FiLogIn, 
  FiX, 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiShield,
  FiAlertCircle,
  FiWifi,
  FiWifiOff
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password: string }) => Promise<void>;
  isLoading?: boolean;
  loginError?: string;
  redirectPath?: string;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  isOpen,
  onClose,
  onLogin,
  isLoading: externalLoading = false,
  loginError: externalError = '',
  redirectPath = '/invoice',
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Мониторинг статуса сети
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Автофокус на поле username
  useEffect(() => {
    if (isOpen && usernameRef.current) {
      setTimeout(() => usernameRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Сброс ошибок при открытии
  useEffect(() => {
    if (isOpen) {
      setError("");
      // Не сбрасываем attempts при открытии
    }
  }, [isOpen]);

  // Обновляем внутреннюю ошибку при изменении внешней
  useEffect(() => {
    if (externalError) {
      setError(externalError);
      // При ошибке увеличиваем счетчик попыток
      setAttempts(prev => prev + 1);
    }
  }, [externalError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Проверка сети
    if (!isOnline) {
      setError("Отсутствует интернет-соединение. Проверьте подключение.");
      return;
    }

    // Проверка на количество попыток
    if (attempts >= 5) {
      setError("Превышено количество попыток. Попробуйте через 15 минут.");
      return;
    }

    // Валидация полей
    if (!username.trim() || !password.trim()) {
      setError("Пожалуйста, введите логин и пароль");
      return;
    }

    if (username.length < 3) {
      setError("Логин должен содержать минимум 3 символа");
      return;
    }

    if (password.length < 4) {
      setError("Пароль должен содержать минимум 4 символа");
      return;
    }

    setIsLoading(true);

    try {
      await onLogin({ username, password });
      // Успешный вход - сбрасываем попытки
      setAttempts(0);
      // Форма закроется автоматически через onClose
    } catch (err: any) {
      // Ошибка уже обработана в onLogin
      // Увеличиваем счетчик попыток при ошибке
      setAttempts(prev => prev + 1);
      
      // Если ошибка содержит сообщение - показываем его
      if (err.message) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClose = () => {
    setError("");
    setPassword("");
    setIsLoading(false);
    // Сбрасываем попытки при закрытии
    setAttempts(0);
    onClose();
  };

  if (!isOpen) return null;

  const loading = isLoading || externalLoading;
  const isBlocked = attempts >= 5;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header с градиентом */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Вход администратора</h2>
                    <p className="text-xs text-orange-100">Защищенный доступ</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  disabled={loading}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Статус сети */}
              <div className={`flex items-center gap-2 text-xs ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
                {isOnline ? (
                  <>
                    <FiWifi className="w-3 h-3" />
                    <span>Подключение к интернету установлено</span>
                  </>
                ) : (
                  <>
                    <FiWifiOff className="w-3 h-3" />
                    <span>Нет подключения к интернету</span>
                  </>
                )}
              </div>

              {/* Ошибки */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  >
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Логин
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="username"
                    ref={usernameRef}
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      // Сбрасываем ошибку при вводе
                      if (error) setError("");
                    }}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white disabled:opacity-50 ${
                      error ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Введите логин"
                    disabled={loading || isBlocked || !isOnline}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Пароль
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Сбрасываем ошибку при вводе
                      if (error) setError("");
                    }}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white disabled:opacity-50 ${
                      error ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Введите пароль"
                    disabled={loading || isBlocked || !isOnline}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading || isBlocked}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Attempts */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    disabled={loading || isBlocked}
                  />
                  Запомнить меня
                </label>
                <span className={`text-xs ${attempts >= 4 ? 'text-red-500' : 'text-gray-400'}`}>
                  Попыток: {attempts}/5
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || isBlocked || !isOnline}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                  ${loading || isBlocked || !isOnline
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Вход...</span>
                  </>
                ) : isBlocked ? (
                  <>
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Доступ заблокирован</span>
                  </>
                ) : !isOnline ? (
                  <>
                    <FiWifiOff className="w-4 h-4" />
                    <span>Нет соединения</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-4 h-4" />
                    <span>Войти</span>
                  </>
                )}
              </button>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400">
                <p>Защищенный доступ только для администраторов</p>
                <p className="mt-1">Все действия логируются</p>
                {attempts >= 4 && attempts < 5 && (
                  <p className="mt-2 text-red-500 text-xs font-medium">
                    ⚠️ Осталась {5 - attempts} попытка
                  </p>
                )}
                {isBlocked && (
                  <p className="mt-2 text-red-500 text-xs font-medium">
                    🔒 Доступ заблокирован на 15 минут
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginForm;
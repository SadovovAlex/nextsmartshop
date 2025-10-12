"use client";
import React, { useState } from "react";
import { FiLogIn, FiX } from "react-icons/fi";

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
  loginError?: string;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  isOpen,
  onClose,
  onLogin,
  isLoading = false,
  loginError = '',
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [internalLoginError, setInternalLoginError] = useState(loginError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Пожалуйста, введите логин и пароль");
      return;
    }

    console.log('Form submitted with credentials:', { username, password });
    console.log('Calling onLogin function with credentials:', { username, password });
    
    try {
      onLogin({ username, password });
      console.log('onLogin function called successfully');
    } catch (error) {
      console.error('Error calling onLogin:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Вход администратора</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Логин
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите логин"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          
          {internalLoginError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {internalLoginError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Вход...
              </>
            ) : (
              <>
                <FiLogIn />
                Войти
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
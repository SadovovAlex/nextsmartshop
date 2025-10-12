"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAdmin: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка существующего токена при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data.user);
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка входа');
      }

      const data = await response.json();
      setAdmin(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Очистка cookie на сервере
      await fetch(`${process.env.NEXTAUTH_URL || '3000'}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      setAdmin(null);
    }
  };

  const value: AdminAuthContextType = {
    admin,
    isAdmin: !!admin,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
// src/components/AdminRouteGuard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLoginForm from './AdminLoginForm';
import { motion } from 'framer-motion';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ 
  children, 
  redirectPath = '/invoice' 
}) => {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // Если админ уже авторизован - показываем контент
  useEffect(() => {
    if (admin) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [admin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Требуется доступ</h1>
              <p className="text-orange-100 text-sm mt-1">
                Войдите как администратор для продолжения
              </p>
            </div>

            <div className="p-6">
              <AdminLoginForm
                isOpen={true}
                onClose={() => {
                  setLoginError('');
                  router.push('/');
                }}
                onLogin={async (credentials) => {
                  try {
                    setLoginError('');
                    // После успешного входа перенаправляем
                    router.push(redirectPath);
                  } catch (error) {
                    setLoginError(error instanceof Error ? error.message : 'Неверный логин или пароль');
                  }
                }}
                loginError={loginError}
                redirectPath={redirectPath}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
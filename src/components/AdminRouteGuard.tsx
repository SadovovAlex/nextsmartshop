"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLoginForm from './AdminLoginForm';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Требуется доступ администратора
            </h1>
            <p className="text-gray-600">
              Пожалуйста, войдите в систему как администратор для просмотра этой страницы.
            </p>
          </div>
          <AdminLoginForm
            isOpen={true}
            onClose={() => {
              setLoginError('');
              router.push('/');
            }}
            onLogin={async (credentials) => {
              try {
                // После успешного входа перенаправляем на страницу invoice
                console.log('Login successful in AdminRouteGuard, redirecting to invoice page');
                router.push('/invoice');
              } catch (error) {
                setLoginError(error instanceof Error ? error.message : 'Неверный логин или пароль');
              }
            }}
            loginError={loginError}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
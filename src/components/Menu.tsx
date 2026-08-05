// Menu.tsx - С корзиной
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaFileInvoice, 
  FaShoppingCart,
  FaInfoCircle,
  FaNewspaper,
  FaUser,
  FaSignOutAlt,
  FaUserPlus
} from "react-icons/fa";
import Link from "next/link";
import Logo from "./Logo";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLoginForm from "./AdminLoginForm";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { StateProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import { motion, AnimatePresence } from "framer-motion";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { admin, login: adminLogin, logout: adminLogout, isLoading } = useAdminAuth();
  const pathname = usePathname();
  
  // Получаем данные корзины
  const { productData } = useSelector((state: StateProps) => state?.shopping || { productData: [] });

  // Подсчет итогов корзины
  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0;
    let price = 0;
    
    if (productData && productData.length > 0) {
      productData.forEach((item: any) => {
        const quantity = Number(item.quantity) || 1;
        const itemPrice = Number(item.price) || 0;
        items += quantity;
        price += itemPrice * quantity;
      });
    }
    
    return { totalItems: items, totalPrice: price };
  }, [productData]);

  // Закрываем меню при смене страницы
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Отслеживаем скролл для эффекта
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Навигационные ссылки
  const navLinks = [
    { href: "/", label: "Главная", icon: FaHome },
    { href: "/price", label: "Прайс", icon: FaFileInvoice },
    { href: "/buklet", label: "Буклет", icon: FaNewspaper },
    { href: "/about", label: "О нас", icon: FaInfoCircle },
    ...(admin ? [{ href: "/invoice", label: "Накладная", icon: FaFileInvoice }] : []),
  ];

  // Проверка активной ссылки
  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  // Форматирование цены
  const formatPrice = (price: number): string => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-gradient-to-r from-gray-800 to-gray-900'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Логотип */}
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Десктопное меню */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : scrolled
                          ? 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Корзина в меню */}
              <Link
                href="/cart"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  pathname === '/cart'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : scrolled
                      ? 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="relative">
                  <FaShoppingCart className="w-4 h-4" />
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="hidden xl:inline">Корзина</span>
                {totalPrice > 0 && (
                  <span className="hidden lg:inline text-xs opacity-75">
                    ({formatPrice(totalPrice)} ₽)
                  </span>
                )}
              </Link>
            </nav>

            {/* Правая часть - админ и мобильное меню */}
            <div className="flex items-center gap-2">
              {/* Админ кнопка */}
              <div className="hidden md:block">
                {admin ? (
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                    <FaUser className="text-orange-400" />
                    <span className="text-sm font-medium text-white">
                      {admin.username}
                    </span>
                    <button
                      onClick={() => adminLogout()}
                      className="text-white/60 hover:text-red-400 transition-colors p-1"
                      title="Выйти"
                    >
                      <FaSignOutAlt className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white text-sm"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    <span className="hidden lg:inline">Вход</span>
                  </button>
                )}
              </div>

              {/* Мобильная корзина */}
              <Link href="/cart" className="md:hidden relative">
                <div className="p-2 rounded-lg bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                  <FaShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {/* Кнопка мобильного меню */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <FaTimes className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                ) : (
                  <FaBars className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-md"
            >
              <div className="flex flex-col h-full overflow-y-auto p-4">
                {/* Ссылки */}
                <nav className="flex-1 space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                        {active && (
                          <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </Link>
                    );
                  })}

                  {/* Корзина в мобильном меню */}
                  <Link
                    href="/cart"
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      pathname === '/cart'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaShoppingCart className="w-5 h-5" />
                      <span className="font-medium">Корзина</span>
                    </div>
                    {totalItems > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {formatPrice(totalPrice)} ₽
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          pathname === '/cart'
                            ? 'bg-white/20 text-white'
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                        </span>
                      </div>
                    )}
                  </Link>
                </nav>

                {/* Админ в мобильном меню */}
                <div className="pt-4 border-t border-gray-200">
                  {admin ? (
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{admin.username}</p>
                          <p className="text-xs text-gray-500">Администратор</p>
                        </div>
                      </div>
                      <button
                        onClick={() => adminLogout()}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaSignOutAlt />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAdminLogin(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                    >
                      <FaUserPlus />
                      Войти как администратор
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Отступ для контента */}
      <div className="h-16" />

      {/* Форма входа администратора */}
      <AdminLoginForm
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={async (credentials) => {
          try {
            await adminLogin(credentials);
            setShowAdminLogin(false);
          } catch (error) {
            console.error('Login error:', error);
          }
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default Menu;
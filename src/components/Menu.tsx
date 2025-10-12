"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Logo from "./Logo";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLoginForm from "./AdminLoginForm";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { admin, login: adminLogin, logout: adminLogout, isLoading } = useAdminAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${isOpen ? "open" : ""}`}>
      <div className="flex justify-between items-center bg-gray-700 text-white p-2.5">
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          <FaBars />
        </div>
        <Link href="/">
          <Logo />
        </Link>
        <nav
          className={`absolute top-full left-0 w-48 bg-gray-700 shadow-md z-30 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:transform-none md:w-auto md:bg-transparent md:shadow-none md:flex md:justify-center`}
        >
          <ul className="list-none md:flex md:space-x-4 ">
            <li className="border-b border-gray-200 md:border-none text-white ">
              <a
                href="/"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                Главная
              </a>
            </li>
            <li className="border-b border-gray-200 md:border-none text-white">
              <a
                href="/price"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                Прайс
              </a>
            </li>
            <li className="border-b border-gray-200 md:border-none text-white">
              <a
                href="/about"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                О нас
              </a>
            </li>
            {admin && (
              <li className="border-b border-gray-200 md:border-none text-white">
                <a
                  href="/invoice"
                  className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
                >
                  Накладная
                </a>
              </li>
            )}
            <li className="border-b border-gray-200 md:border-none text-white">
              <a
                href="/cart"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                Корзина
              </a>
            </li>
          </ul>
          
          {/* Административный вход/выход */}
          <div className="flex items-center gap-x-2 px-4 py-2 border-t border-gray-200 md:border-none md:px-0 md:py-0">
            {admin ? (
              <div className="flex items-center gap-x-2 bg-slate-800/50 rounded-full px-3 py-1.5">
                <FiUser className="text-gray-300" />
                <span className="text-sm font-medium text-gray-300">
                  {admin.username}
                </span>
                <button
                  onClick={() => adminLogout()}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Выйти"
                >
                  <FiLogOut className="text-sm" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-x-1 bg-slate-800/50 hover:bg-slate-700/50 rounded-full px-3 py-1.5 transition-colors"
              >
                <FiUser className="text-gray-300" />
                <span className="text-sm font-medium text-gray-300"></span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Форма входа администратора */}
      <AdminLoginForm
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={async (credentials) => {
          try {
            await adminLogin(credentials);
            setShowAdminLogin(false);
          } catch (error) {
            // Error handling is done within the AdminLoginForm
            console.error('Login error:', error);
          }
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Menu;

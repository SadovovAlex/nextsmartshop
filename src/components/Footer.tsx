// Footer.tsx - Исправленная версия
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiTruck,
  FiAward,
  FiChevronRight,
  FiHome,
  FiFileText,
  FiInfo,
  FiShoppingCart,
  FiFile
} from "react-icons/fi";
import { CONTACT, TEXT, ROUTES } from "@/constants/text";
import packageJson from '../../package.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Навигационные ссылки
  const navLinks = [
    { href: ROUTES.HOME, label: "Главная", icon: FiHome },
    { href: ROUTES.PRICE, label: "Прайс", icon: FiFileText },
    { href: ROUTES.ABOUT, label: "О нас", icon: FiInfo },
    { href: ROUTES.CART, label: "Корзина", icon: FiShoppingCart },
    { href: ROUTES.INVOICE, label: "Накладная", icon: FiFile },
  ];

  // Информационные блоки
  const infoBlocks = [
    {
      icon: FiTruck,
      title: "Доставка",
      description: "Бесплатная доставка в Москву, МО, Тулу, Калугу, Липецк",
      detail: "При определенной сумме заказа"
    },
    {
      icon: FiClock,
      title: "График работы",
      description: "Пн, Вт, Чт, Пт, Сб",
      detail: "Прием заказов: 8:00 - 10:00"
    },
    {
      icon: FiAward,
      title: "Качество",
      description: "Ветеринарный контроль",
      detail: "Отправка по системе Меркурий"
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 print:hidden">
      {/* Основной футер */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* ===== КОЛОНКА 1: ИНФОРМАЦИЯ ===== */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                О нас
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Работаем с розничными магазинами, сетями и продуктовыми рынками. 
                Предлагаем качественную молочную продукцию по выгодным условиям.
              </p>
              <p className="text-sm leading-relaxed text-gray-400">
                <span className="text-orange-400 font-semibold">Опт</span> на выгодных условиях.
                Ветеринарное свидетельство отправляем по системе Меркурий.
              </p>
              <div className="flex flex-col gap-1 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <FiTruck className="text-orange-400 w-4 h-4" />
                  <span>{TEXT.DELIVERY}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiClock className="text-orange-400 w-4 h-4" />
                  <span>Дни доставки: пн, вт, чт, пт, сб</span>
                </p>
              </div>
            </div>

            {/* ===== КОЛОНКА 2: КОНТАКТЫ ===== */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                Контакты
              </h3>
              
              <div className="space-y-3">
                {/* Телефон */}
                <div className="group">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Телефон</p>
                  <a
                    href={`tel:${CONTACT.PHONE}`}
                    className="text-white font-semibold text-lg hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <FiPhone className="w-4 h-4 text-orange-400" />
                    {CONTACT.PHONE_FORMATTED}
                  </a>
                </div>

                {/* Email */}
                <div className="group">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <a
                    href={`mailto:${CONTACT.EMAIL}`}
                    className="text-white font-semibold hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <FiMail className="w-4 h-4 text-orange-400" />
                    {CONTACT.EMAIL}
                  </a>
                </div>

                {/* Адрес */}
                <div className="group">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Адрес</p>
                  <a
                    href="https://maps.google.com/maps/search/Рязанская+область,+село+Заокское"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <FiMapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>Рязанская область, село Заокское</span>
                  </a>
                </div>

                {/* Время работы */}
                <div className="group">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Прием заказов</p>
                  <div className="flex items-center gap-2 text-white">
                    <FiClock className="w-4 h-4 text-orange-400" />
                    <span>8:00 - 10:00 ежедневно</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== КОЛОНКА 3: БЫСТРЫЕ ССЫЛКИ ===== */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                Навигация
              </h3>
              
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-all duration-200 group text-sm"
                      >
                        <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all" />
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ===== КОЛОНКА 4: QR КОД ===== */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full" />
                QR-код
              </h3>
              
              <div className="flex flex-col items-center bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                <div className="relative w-32 h-32 bg-white rounded-xl p-2 transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/static/qr-code.webp"
                    alt="QR-код сайта"
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Наведите камеру для перехода на сайт
                </p>
              </div>
            </div>
          </div>

          {/* ===== ИНФОРМАЦИОННЫЕ КАРТОЧКИ ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-800">
            {infoBlocks.map((block, index) => {
              const Icon = block.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{block.title}</h4>
                    <p className="text-xs text-gray-400">{block.description}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{block.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== НИЖНИЙ БАР ===== */}
      <div className="bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {currentYear} Рязанская молочная ферма Заокское. 
              <span className="hidden sm:inline"> Все права защищены.</span>
            </p>
            
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">
                Разработка: 
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WRDev v{packageJson.version}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
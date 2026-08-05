// about/page.tsx - Улучшенный дизайн
"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/Container";
import Menu from "@/components/Menu";
import { CONTACT } from "@/constants/text";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCheckCircle, 
  FiTruck, 
  FiAward,
  FiUsers,
  FiHeart,
  FiShield,
  FiPackage,
  FiDroplet,
  FiChevronRight
} from "react-icons/fi";
import Image from "next/image";

const AboutPage = () => {
  // Данные для преимуществ
  const advantages = [
    {
      icon: FiDroplet,
      title: "Натуральное молоко",
      description: "Только свежее молоко от здоровых коров, выращенных на экологически чистых кормах"
    },
    {
      icon: FiShield,
      title: "Контроль качества",
      description: "Строгий контроль на всех этапах производства, подтвержденный сертификатами"
    },
    {
      icon: FiTruck,
      title: "Бесплатная доставка",
      description: "Бесплатная доставка при заказе от определенной суммы по Рязанской области"
    },
    {
      icon: FiAward,
      title: "Ветеринарный контроль",
      description: "Все продукты проходят ветеринарный контроль с отправкой по системе Меркурий"
    }
  ];

  // Данные для продукции
  const products = [
    { name: "Пастеризованное молоко", icon: "🥛" },
    { name: "Сметана", icon: "🍶" },
    { name: "Творог", icon: "🧀" },
    { name: "Йогурты", icon: "🥤" },
    { name: "Сыры различных сортов", icon: "🧀" },
    { name: "Кефир", icon: "🥛" },
    { name: "Ряженка", icon: "🍶" },
    { name: "Масло сливочное", icon: "🧈" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Menu />
      
      {/* ===== ХЕРО-СЕКЦИЯ ===== */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="relative py-16 md:py-24 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Добро пожаловать
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              О нас
            </h1>
            <p className="text-lg md:text-xl text-orange-50 max-w-2xl mx-auto">
              Качественная молочная продукция от производителя
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* ===== ОСНОВНАЯ ИНФОРМАЦИЯ ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiHeart className="text-orange-500" />
              О компании
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Мы работаем с розничными магазинами и продуктовыми рынками, предлагая
              высококачественную продукцию по выгодным условиям.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Также мы осуществляем оптовые поставки на выгодных условиях. Мы
              гарантируем, что все наши продукты соответствуют необходимым
              стандартам качества.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Ветеринарное свидетельство отправляем по системе Меркурий, что
              обеспечивает прозрачность и безопасность наших поставок.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage className="text-orange-500" />
              Наша продукция
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Наша молочная продукция производится из свежего, натурального молока,
              полученного от здоровых коров, которые питаются качественными кормами.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {products.map((product, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors"
                >
                  <span className="text-lg">{product.icon}</span>
                  <span className="text-sm text-gray-700">{product.name}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Все наши продукты проходят строгий контроль качества и сохраняют
              все полезные свойства молока, что делает их идеальными для
              здорового питания.
            </p>
          </div>
        </div>

        {/* ===== ПРЕИМУЩЕСТВА ===== */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Наши преимущества
            </h2>
            <p className="text-gray-500">
              Почему выбирают нашу продукцию
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, index) => {
              const Icon = adv.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {adv.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== КОНТАКТЫ ===== */}
        <div className="mt-16 mb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Левая часть - информация */}
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Свяжитесь с нами
                </h2>
                <p className="text-gray-500 mb-8">
                  Мы всегда рады ответить на ваши вопросы и помочь с выбором продукции
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <FiPhone className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <a 
                        href={`tel:${CONTACT.PHONE}`}
                        className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                      >
                        {CONTACT.PHONE_FORMATTED}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <FiMail className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href={`mailto:${CONTACT.EMAIL}`}
                        className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                      >
                        {CONTACT.EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <FiMapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Адрес</p>
                      <p className="text-lg font-semibold text-gray-800">
                        Рязанская область, село Заокское
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCheckCircle className="text-green-500 w-5 h-5" />
                    <span>Работаем с розничными магазинами и рынками</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <FiCheckCircle className="text-green-500 w-5 h-5" />
                    <span>Оптовые поставки на выгодных условиях</span>
                  </div>
                </div>
              </div>

              {/* Правая часть - карта или изображение */}
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-8 lg:p-12 flex items-center justify-center min-h-[300px] lg:min-h-auto">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <FiUsers className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Мы ждем вас!
                  </h3>
                  <p className="text-orange-100">
                    Приходите к нам за качественной продукцией
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      🕐 Пн-Сб: 9:00 - 18:00
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      🕐 Вс: Выходной
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== КНОПКА В КАТАЛОГ ===== */}
        <div className="text-center pb-12">
          <Link href="/">
            <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
              Перейти в каталог
              <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </Container>

      {/* ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ===== */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
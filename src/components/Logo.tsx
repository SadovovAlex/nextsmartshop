// Logo.tsx - С тултипом для дополнительной информации
"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { CONTACT } from "@/constants/text";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${CONTACT.PHONE}`;
    }
  };

  return (
    <Link href="/" className="block flex-shrink-0">
      <div 
        className="flex items-center gap-2 md:gap-3 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Логотип */}
        <div className="relative flex-shrink-0">
          <div className={`w-9 h-9 md:w-11 md:h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-0.5 transition-all duration-300 ${
            isHovered ? 'shadow-lg shadow-orange-500/30' : ''
          }`}>
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/static/logo.webp"
                alt="Рязанская молочная ферма Заокское"
                className={`w-7 h-7 md:w-8 md:h-8 object-contain transition-all duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                width={500}
                height={300}
                priority
              />
            </div>
          </div>
          
          {/* Онлайн-индикатор */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* Текстовая часть */}
        <div className="flex flex-col min-w-0 max-w-[160px] md:max-w-[250px]">
          {/* Название фермы */}
          <div className="hidden sm:block truncate">
            <h1 className={`text-[10px] md:text-xs font-bold text-gray-800 transition-colors duration-300 whitespace-nowrap ${
              isHovered ? 'text-orange-500' : ''
            }`}>
              Рязанская молочная ферма
            </h1>
            <p className="text-[8px] md:text-[10px] text-gray-400 font-medium -mt-0.5">
              с. Заокское
            </p>
          </div>

          {/* Телефон */}
          <button
            onClick={handlePhoneClick}
            className={`flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
              isHovered 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            }`}
          >
            <FiPhone className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isHovered ? 'animate-pulse' : ''}`} />
            <span className="hidden xs:inline">{CONTACT.PHONE_FORMATTED}</span>
            <span className="xs:hidden">{CONTACT.PHONE_FORMATTED}</span>
          </button>
        </div>

        {/* Тултип с дополнительной информацией - появляется сверху */}
        {isHovered && (
          <div className="absolute left-0 -top-[130px] z-50 w-64 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 animate-fadeInUp hidden lg:block">
            <div className="absolute bottom-[-8px] left-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiClock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Пн-Сб: 08:00 - 18:00</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiMail className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <a href={`mailto:${CONTACT.EMAIL}`} className="hover:text-orange-500 transition-colors">
                  {CONTACT.EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiMapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Рязанская область, с. Заокское</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;
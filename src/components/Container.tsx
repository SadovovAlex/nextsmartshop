// Container.tsx - Исправленная версия
"use client";

import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  showScrollButton?: boolean; // Добавляем опцию для отключения кнопки
}

const Container = ({ children, className, showScrollButton = true }: Props) => {
  const [showButton, setShowButton] = useState(false);

  // Функция для проверки положения прокрутки
  const checkScrollTop = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Функция для прокрутки вверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Добавляем слушатель события прокрутки только если кнопка разрешена
  useEffect(() => {
    if (!showScrollButton) return;
    
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScrollButton]);

  return (
    <div className={`${className} max-w-screen-xl mx-auto px-4 xl:px-0 mt-[10px]`}>
      {children}

      {/* Кнопка "Вернуться вверх" - только если showScrollButton = true */}
      {showScrollButton && showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          aria-label="Вернуться вверх"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:-translate-y-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Container;
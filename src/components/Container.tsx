"use client";

import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Функция для проверки положения прокрутки
  const checkScrollTop = () => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  // Функция для прокрутки вверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Плавная прокрутка
    });
  };

  // Добавляем слушатель события прокрутки
  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  return (
    <div className={`${className} max-w-screen-xl mx-auto px-4 xl:px-0 mt-[10px]`}>
      {children}

      {/* Кнопка "Вернуться вверх" */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Вернуться вверх"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
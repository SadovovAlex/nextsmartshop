// Header.tsx - С категориями в строку
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Container from "./Container";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onSearchFocus?: (isFocused: boolean) => void;
  categories?: string[];
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onSearchFocus,
  categories = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [categoryPositions, setCategoryPositions] = useState<Map<string, number>>(new Map());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Отслеживаем скролл для определения активной категории
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120; // Учитываем высоту хедера

      if (categories.length > 0 && categoryPositions.size > 0) {
        let currentCategory = "";
        let minDistance = Infinity;

        categoryPositions.forEach((position, category) => {
          const distance = Math.abs(scrollY - position);
          if (distance < minDistance) {
            minDistance = distance;
            currentCategory = category;
          }
        });

        if (currentCategory && currentCategory !== activeCategory) {
          setActiveCategory(currentCategory);
          // Прокручиваем категорию в видимую область
          scrollCategoryIntoView(currentCategory);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, categoryPositions, activeCategory]);

  // Определяем позиции категорий на странице
  useEffect(() => {
    if (categories.length > 0) {
      const timer = setTimeout(() => {
        const positions = new Map<string, number>();
        categories.forEach(cat => {
          const element = document.getElementById(`category-${cat}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            positions.set(cat, rect.top + window.scrollY - 100);
          }
        });
        setCategoryPositions(positions);
        
        // Устанавливаем первую категорию как активную
        if (categories.length > 0 && !activeCategory) {
          setActiveCategory(categories[0]);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [categories]);

  // Проверка возможности прокрутки
  const checkScrollButtons = useCallback(() => {
    if (categoryContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Обновляем состояние кнопок при изменении размера
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [checkScrollButtons]);

  // Прокрутка категорий
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = categoryContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      categoryContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
      
      // Обновляем состояние кнопок после прокрутки
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Прокрутка категории в видимую область
  const scrollCategoryIntoView = (category: string) => {
    if (categoryContainerRef.current && categoriesRef.current) {
      const categoryElements = categoriesRef.current.querySelectorAll('.category-item');
      const targetElement = Array.from(categoryElements).find(
        el => el.getAttribute('data-category') === category
      );
      
      if (targetElement) {
        const container = categoryContainerRef.current;
        const elementRect = targetElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const elementCenter = elementRect.left + elementRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const offset = elementCenter - containerCenter;
        
        container.scrollBy({
          left: offset,
          behavior: 'smooth'
        });
        
        setTimeout(checkScrollButtons, 300);
      }
    }
  };

  // Скролл к категории
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const headerHeight = 160;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth",
      });
      setActiveCategory(category);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
    if (onSearchFocus) {
      onSearchFocus(value.length > 0);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
    if (onSearchFocus) {
      onSearchFocus(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onSearchFocus && searchTerm.length > 0) {
      onSearchFocus(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      ref={headerRef}
      className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300"
    >
      <Container className="py-2 md:py-2.5" showScrollButton={false}>
        <div className="flex items-center gap-2 md:gap-3">
          {/* Поиск - уменьшенный */}
          <div className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px]">
            <div 
              className={`relative flex items-center bg-gray-50 rounded-full transition-all duration-300 ${
                isFocused ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/10' : 'hover:bg-gray-100'
              }`}
            >
              <FiSearch className={`absolute left-3 w-4 h-4 transition-colors ${
                isFocused ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Поиск..."
                className="w-full pl-9 pr-8 py-1.5 md:py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={handleClearSearch}
                    className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Категории - строка с прокруткой */}
          {categories.length > 0 && (
            <div className="flex-1 min-w-0 relative">
              {/* Кнопка прокрутки влево */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCategories('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white to-transparent pl-1 pr-3 py-1 rounded-l-full hover:text-orange-500 transition-colors"
                  aria-label="Прокрутить категории влево"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Контейнер категорий */}
              <div 
                ref={categoryContainerRef}
                className="overflow-x-auto scrollbar-hide px-1"
                onScroll={checkScrollButtons}
              >
                <div 
                  ref={categoriesRef}
                  className="flex gap-1 md:gap-1.5 py-0.5 whitespace-nowrap"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      data-category={cat}
                      onClick={() => scrollToCategory(cat)}
                      className={`
                        category-item px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex-shrink-0
                        ${activeCategory === cat
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                        }
                      `}
                    >
                      {cat}
                      {activeCategory === cat && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Кнопка прокрутки вправо */}
              {canScrollRight && (
                <button
                  onClick={() => scrollCategories('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white to-transparent pr-1 pl-3 py-1 rounded-r-full hover:text-orange-500 transition-colors"
                  aria-label="Прокрутить категории вправо"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Стили для скрытия скроллбара */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Анимация выделения */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .animate-pulse {
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Header;
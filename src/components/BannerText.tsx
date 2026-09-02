// src/components/BannerStatic.tsx - Компактная версия

"use client";

import { useState, useEffect } from "react";
import bannerone from "@/images/bannerone.webp";
import bannertwo from "@/images/bannertwo.webp";
import bannerthree from "@/images/bannerthree.webp";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiPhone } from "react-icons/fi";
import { CONTACT } from "@/constants/text";

interface BannerProps {
  hide?: boolean;
}

const Banner = ({ hide = false }: BannerProps) => {
  const banners = [
    { 
      image: bannerone, 
      alt: 'Рязанская молочная ферма Заокское', 
      title: 'Натуральная молочная продукция',
      subtitle: 'Рязанская молочная ферма Заокское'
    },
    { 
      image: bannertwo, 
      alt: 'Молоко и продукция из натурального молока', 
      title: 'Творог и творожная продукция',
      subtitle: 'Домашний вкус из Рязани'
    },
    { 
      image: bannerthree, 
      alt: 'Продукция из натурального молока', 
      title: 'Свежее молоко каждый день',
      subtitle: 'От производителя с любовью'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || hide) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, hide, banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentBanner = banners[currentIndex];

  return (
    <AnimatePresence mode="wait">
      {!hide && (
        <motion.div 
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="relative w-full overflow-hidden"
        >
          <div className="relative w-full xs:h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={currentBanner.image}
                  alt={currentBanner.alt}
                  className="w-full h-full object-cover"
                  priority
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* КОМПАКТНЫЙ ТЕКСТ БАННЕРА */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {/* Бейдж */}
                    <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      🔥 Только свежие продукты
                    </span>
                    
                    {/* Заголовок */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                      {currentBanner.title}
                    </h1>
                    
                    {/* Подзаголовок */}
                    <p className="text-sm sm:text-base text-white/90 mb-4">
                      {currentBanner.subtitle}
                    </p>
                    
                    {/* Кнопки */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="#products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-sm"
                      >
                        Смотреть каталог
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href={`tel:${CONTACT.PHONE}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 text-sm border border-white/30"
                      >
                        <FiPhone className="w-4 h-4" />
                        {CONTACT.PHONE_FORMATTED}
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Индикаторы - компактные */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? 'w-6 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>

            {/* Кнопки навигации - компактные */}
            <button
              onClick={goToPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
              aria-label="Предыдущий слайд"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
              aria-label="Следующий слайд"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
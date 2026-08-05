// BannerStatic.tsx - С поддержкой скрытия
"use client";

import { useState, useEffect } from "react";
import bannerone from "@/images/bannerone.webp";
import bannertwo from "@/images/bannertwo.webp";
import bannerthree from "@/images/bannerthree.webp";
import Image from "next/image";
import BannerText from "./BannerText";
import { motion, AnimatePresence } from "framer-motion";

interface BannerProps {
  hide?: boolean; // Добавляем опцию скрытия
}

const Banner = ({ hide = false }: BannerProps) => {
  const banners = [
    { image: bannerone, alt: 'Рязанская молочная ферма Заокское', title: 'Рязанская молочная ферма Заокское' },
    { image: bannertwo, alt: 'Молоко и продукция из натурального молока', title: 'Творог и творожная продукция Рязани' },
    { image: bannerthree, alt: 'Продукция из натурального молока', title: 'Домашняя Молочная продукция из Рязани' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Автопереключение
  useEffect(() => {
    if (!isAutoPlaying || hide) return; // Останавливаем автоплей если баннер скрыт
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, hide, banners.length]);

  // Ручное переключение
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
          <div className="relative w-full xs:h-[300px] md:h-[450px] lg:h-[500px]">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Текст баннера */}
            <BannerText title={currentBanner.title} />

            {/* Индикаторы */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? 'w-8 h-2.5 bg-white'
                      : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>

            {/* Кнопки навигации */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors text-white"
              aria-label="Предыдущий слайд"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors text-white"
              aria-label="Следующий слайд"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
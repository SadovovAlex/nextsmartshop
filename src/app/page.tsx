// src/app/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Banner from "@/components/BannerStatic";
import Products from "@/components/Products";
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../type";
import { CONTACT, TEXT } from "@/constants/text";
import { FiTruck, FiAward, FiDroplet, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await getProducts();
        const categoryOrder = [
          'Молоко', 'Сметана', 'Творог', 'Йогурты', 'Сыры', 
          'Масло', 'Кефир', 'Ряженка', 'Другое'
        ];
        
        const uniqueCategories = Array.from(
          new Set(products.map((p: ProductsStruct) => p.cat_name).filter(Boolean))
        ) as string[];
        
        const sorted = uniqueCategories.sort((a, b) => {
          const indexA = categoryOrder.indexOf(a);
          const indexB = categoryOrder.indexOf(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
        
        setCategories(sorted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearchActive(term.length > 0);
  };

  const handleSearchFocus = (focused: boolean) => {
    if (searchTerm.length > 0) {
      setIsSearchActive(true);
    }
  };

  const quickAdvantages = [
    { icon: FiDroplet, text: "Натуральное молоко" },
    { icon: FiTruck, text: "Бесплатная доставка" },
    { icon: FiAward, text: "Контроль качества" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Menu />
      <Header 
        onSearch={handleSearch} 
        onSearchFocus={handleSearchFocus}
        categories={categories}
      />
      
      {/* Баннер - компактный и информативный */}
      <Banner hide={isSearchActive} />
      
      <Container>
        {/* ===== КОМПАКТНЫЙ БЛОК "О НАС" ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 mt-4 mb-8 border border-orange-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500 text-sm font-semibold uppercase tracking-wider">
                  О нас
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {TEXT.TITLE}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                {TEXT.SLOGAN}. Работаем с розничными магазинами, сетями и продуктовыми рынками.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-600">
                  📞 {CONTACT.PHONE_FORMATTED}
                </span>
                <span className="text-gray-600">
                  ✉️ {CONTACT.EMAIL}
                </span>
                <Link href="/about" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                  Подробнее
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-3">
              {quickAdvantages.map((adv, index) => {
                const Icon = adv.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{adv.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ===== ПРОДУКТЫ ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Products searchTerm={searchTerm} categories={categories} />
        </motion.div>
      </Container>
    </main>
  );
}
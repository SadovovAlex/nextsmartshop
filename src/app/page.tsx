// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Banner from "@/components/BannerStatic";
import Products from "@/components/Products";
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../type";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await getProducts();
        // Получаем уникальные категории в правильном порядке
        const categoryOrder = [
          'Молоко', 'Сметана', 'Творог', 'Йогурты', 'Сыры', 
          'Масло', 'Кефир', 'Ряженка', 'Другое'
        ];
        
        const uniqueCategories = Array.from(
          new Set(products.map((p: ProductsStruct) => p.cat_name).filter(Boolean))
        ) as string[];
        
        // Сортируем по порядку
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Menu />
      <Header 
        onSearch={handleSearch} 
        onSearchFocus={handleSearchFocus}
        categories={categories}
      />
      
      <Banner hide={isSearchActive} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Products searchTerm={searchTerm} categories={categories} />
      </motion.div>
    </main>
  );
}
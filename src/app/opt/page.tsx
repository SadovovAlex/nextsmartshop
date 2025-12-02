'use client';

import React from 'react';
import ProductsOpt from '@/components/ProductsOpt';
import Banner from '@/components/BannerStatic';
import Header from '@/components/Header';
import Menu from '@/components/Menu';

export default function OptPage() {
  const handleSearch = (term: string) => {
    // Пустая функция для оптовой страницы
  };

  return (
    <main>
      <Menu />
      <Header onSearch={handleSearch} />
      <Banner />
      <div className="py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Каталог товаров (Оптовая цена)</h1>
        <ProductsOpt />
      </div>
    </main>
  );
}
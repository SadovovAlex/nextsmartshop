"use client";
import React, { useState } from "react";
import Banner from "@/components/BannerStatic";
import Products from "@/components/Products";
import Header from "@/components/Header"; 
import Menu from "@/components/Menu"; 

export default function Home() {
  
  const [searchTerm, setSearchTerm] = useState(""); // Создаем состояние с функцией для обновления
  const handleSearch = (term: string) => {
    setSearchTerm(term); // Обновляем состояние при изменении
  };

  return (
    <main>
      <Menu /> {/* Добавляем компонент меню */}
      <Header onSearch={handleSearch} /> {/* Передаем функцию для обновления searchTerm */}
      
      <Banner />
      <Products searchTerm={searchTerm} /> {/* Передаем searchTerm в Products */}
    </main>
  );
}

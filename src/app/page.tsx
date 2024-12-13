"use client";
import React, { useState } from "react";
import Banner from "@/components/BannerStatic";
import Products from "@/components/Products";
import Header from "@/components/Header"; 

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(""); // Создаем состояние с функцией для обновления

  const handleSearch = (term: string) => {
    setSearchTerm(term); // Обновляем состояние при изменении
  };

  return (
    <main>
      <Header onSearch={handleSearch} /> {/* Передаем функцию для обновления searchTerm */}
      <Banner />
      <Products searchTerm={searchTerm} /> {/* Передаем searchTerm в Products */}
    </main>
  );
}

"use client";

import React, { useState } from "react";
import Banner from "@/components/BannerStatic";
import Products from "@/components/Products";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <main>
        <Menu />
        <Header onSearch={handleSearch} />
        <Banner />
        <Products searchTerm={searchTerm} />
    </main>
  );
}

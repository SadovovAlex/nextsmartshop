"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import "./css/globals.css";
import type { Metadata } from "next";
import Layout from "@/components/Layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/Footer";

// export const metadata: Metadata = {
//   title: {
//     template: "shopping_mart",
//     default: "Молочная ферма Шуваловых, Рязань",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) 
{
const [searchTerm, setSearchTerm] = useState(""); // Исправлено: используйте searchTerm вместо setSearchTerm
// Создайте функцию, которая будет передаваться в Header
const handleSearch = (term: string) => {
  setSearchTerm(term);
  // Здесь вы можете добавить дополнительную логику для обработки поиска
  //console.log("Searching for:", term);
};

  return (
    <html lang="en">
      <body className="font-bodyFont w-full bg-main-bg text-darkText">
        <Layout>
       
          {children}
          <Footer />
        </Layout>
      </body>
    </html>
  );
}

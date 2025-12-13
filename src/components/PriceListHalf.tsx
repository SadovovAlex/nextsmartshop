"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductsStruct } from "../../type";

interface PriceListHalfProps {
  products: (ProductsStruct | null)[];
  searchTerm: string;
  title: string;
}

const PriceListHalf: React.FC<PriceListHalfProps> = ({ products, searchTerm, title }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Фильтрация продуктов на основе searchTerm
  const filteredProducts = products.filter((item) => {
    if (!item) return true; // Keep null items
    const isMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isMatch;
  });

  // Сортировка продуктов
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (!a || !b) return 0;
    if (sortColumn === "title") {
      return sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortColumn === "type") {
      return sortDirection === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    } else if (sortColumn === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortColumn === "cat_name") {
      return sortDirection === "asc"
        ? a.cat_name.localeCompare(b.cat_name, "ru")
        : b.cat_name.localeCompare(a.cat_name, "ru");
    } else if (sortColumn === "id") {
      return sortDirection === "asc" ? a._id - b._id : b._id - a._id;
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 print:bg-transparent">
            <th
              className="px-2 py-1 cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:no-underline print:no-underline print:cursor-default text-left"
              onClick={() => handleSort("id")}
            >
              #
            </th>
            <th className="px-2 py-1 print:px-1 print:py-0.5 text-left"></th>
            <th
              className="px-2 py-1 cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:no-underline print:no-underline print:cursor-default text-left"
              onClick={() => handleSort("title")}
            >
              Наименование
            </th>
            <th className="px-2 py-1 cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:no-underline print:no-underline print:cursor-default text-left"
              onClick={() => handleSort("cat_name")}
            >
              Категория
            </th>
            <th
              className="px-2 py-1 cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:no-underline print:no-underline print:cursor-default text-left"
              onClick={() => handleSort("type")}
            >
              Ед.изм.
            </th>
            <th
              className="px-2 py-1 cursor-pointer hover:bg-gray-300 print:px-1 print:py-0.5 print:text-xs print:font-normal print:no-underline print:no-underline print:cursor-default text-left"
              onClick={() => handleSort("price")}
            >
              Цена,₽
            </th>
          </tr>
        </thead>
        <tbody className="text-xs print:text-xs">
          {sortedProducts.map((item: ProductsStruct | null, index) => (
            item ? (
              <tr
                key={item._id}
                className={`border-b hover:bg-green-100 transition-colors duration-300 print:border-b print:border-gray-300 print:hover:bg-transparent print:bg-transparent ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="px-1 py-1 print:px-1 print:py-0.5">
                  <Link
                    href={{
                      pathname: "/product",
                      query: { _id: item?._id },
                    }}
                  >
                    {item?._id}
                  </Link>
                </td>
                <td className="px-1 py-1 print:px-1 print:py-0.5">
                  <Link
                    href={{
                      pathname: "/product",
                      query: { _id: item?._id },
                    }}
                  >
                    <Image
                      src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
                      alt="product image"
                      width={25}
                      height={25}
                    />
                  </Link>
                </td>
                <td className="px-2 py-1 print:px-1 print:py-0.5">
                  <Link
                    href={{
                      pathname: "/product",
                      query: { _id: item?._id },
                    }}
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="px-2 py-1 print:px-1 print:py-0.5">{item?.cat_name}</td>
                <td className="px-2 py-1 print:px-1 print:py-0.5">{item?.type}</td>
                <td className="px-2 py-1 print:px-1 print:py-0.5">{item?.price}</td>
              </tr>
            ) : (
              <tr
                key={`empty-${index}`}
                className={`border-b print:border-b print:border-gray-300 print:bg-transparent ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="px-1 py-1 print:px-1 print:py-0.5" colSpan={6}></td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceListHalf;
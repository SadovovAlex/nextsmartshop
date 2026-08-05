// PriceList.tsx - Уменьшенные строки для печати
"use client";

import { getProducts } from "@/helpers";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { ProductsStruct } from "../../type";
import Link from "next/link";
import { 
  FiArrowUp, 
  FiArrowDown,
  FiAlertCircle
} from "react-icons/fi";

interface PriceListProps {
  searchTerm: string;
}

const PriceList: React.FC<PriceListProps> = ({ searchTerm }) => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ===== ФИЛЬТРАЦИЯ ПО ПОИСКУ =====
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const search = searchTerm.toLowerCase();
    return products.filter((item) => {
      return (
        item.title?.toLowerCase().includes(search) ||
        item.cat_name?.toLowerCase().includes(search) ||
        item.type?.toLowerCase().includes(search) ||
        item.ingredients?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        String(item._id).includes(search)
      );
    });
  }, [products, searchTerm]);

  // ===== СОРТИРОВКА =====
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    if (!sortColumn) return sorted;

    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case "title":
          comparison = (a.title || '').localeCompare(b.title || '', 'ru');
          break;
        case "type":
          comparison = (a.type || '').localeCompare(b.type || '', 'ru');
          break;
        case "price":
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case "cat_name":
          comparison = (a.cat_name || '').localeCompare(b.cat_name || '', 'ru');
          break;
        case "id":
          comparison = (a._id || 0) - (b._id || 0);
          break;
        case "quantity":
          comparison = (a.quantity || 0) - (b.quantity || 0);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredProducts, sortColumn, sortDirection]);

  // ===== ОБРАБОТЧИК СОРТИРОВКИ =====
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // ===== ФОРМАТИРОВАНИЕ ЦЕНЫ =====
  const formatPrice = (price: number): string => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // ===== КОМПОНЕНТ ЗАГРУЗКИ =====
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-500">Загрузка товаров...</p>
      </div>
    );
  }

  // ===== ПУСТОЙ РЕЗУЛЬТАТ =====
  if (sortedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
        <FiAlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Ничего не найдено</h3>
        <p className="text-gray-400">Попробуйте изменить поисковый запрос</p>
        {searchTerm && (
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                input.value = '';
                input.dispatchEvent(new Event('change'));
              }
            }}
            className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Очистить поиск
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden print:shadow-none">
      {/* ===== СТАТИСТИКА ===== */}
      <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50 print:hidden text-xs text-gray-500">
        <span>
          {searchTerm ? (
            <>Найдено: <span className="font-semibold text-gray-700">{sortedProducts.length}</span> из {products.length} товаров</>
          ) : (
            <>{products.length} товаров</>
          )}
        </span>
      </div>

      {/* ===== ТАБЛИЦА ===== */}
      <div className="overflow-x-auto print:overflow-x-visible">
        <table className="w-full table-auto border-collapse print:table text-sm print:text-[10px]">
          <thead>
            <tr className="bg-gray-50 print:bg-gray-100">
              <th
                className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[9px] print:font-bold text-left whitespace-nowrap border-b border-gray-200"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-0.5">
                  #
                  {sortColumn === "id" && (
                    sortDirection === "asc" ? <FiArrowUp className="w-2.5 h-2.5" /> : <FiArrowDown className="w-2.5 h-2.5" />
                  )}
                </div>
              </th>
              <th className="px-2 py-1.5 print:px-1.5 print:py-0.5 text-left whitespace-nowrap border-b border-gray-200">Фото</th>
              <th
                className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[9px] print:font-bold text-left whitespace-nowrap border-b border-gray-200"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-0.5">
                  Наименование
                  {sortColumn === "title" && (
                    sortDirection === "asc" ? <FiArrowUp className="w-2.5 h-2.5" /> : <FiArrowDown className="w-2.5 h-2.5" />
                  )}
                </div>
              </th>
              <th
                className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[9px] print:font-bold text-left whitespace-nowrap border-b border-gray-200"
                onClick={() => handleSort("cat_name")}
              >
                <div className="flex items-center gap-0.5">
                  Категория
                  {sortColumn === "cat_name" && (
                    sortDirection === "asc" ? <FiArrowUp className="w-2.5 h-2.5" /> : <FiArrowDown className="w-2.5 h-2.5" />
                  )}
                </div>
              </th>
              <th
                className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[9px] print:font-bold text-left whitespace-nowrap border-b border-gray-200"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-0.5">
                  Ед.изм.
                  {sortColumn === "type" && (
                    sortDirection === "asc" ? <FiArrowUp className="w-2.5 h-2.5" /> : <FiArrowDown className="w-2.5 h-2.5" />
                  )}
                </div>
              </th>
              <th
                className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[9px] print:font-bold text-right whitespace-nowrap border-b border-gray-200"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end gap-0.5">
                  Цена, ₽
                  {sortColumn === "price" && (
                    sortDirection === "asc" ? <FiArrowUp className="w-2.5 h-2.5" /> : <FiArrowDown className="w-2.5 h-2.5" />
                  )}
                </div>
              </th>
              <th
                className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[9px] print:font-bold text-right whitespace-nowrap border-b border-gray-200 hidden lg:table-cell"
                onClick={() => handleSort("quantity")}
              >
                <div className="flex items-center justify-end gap-0.5">
                  Наличие
                  {sortColumn === "quantity" && (
                    sortDirection === "asc" ? <FiArrowUp className="w-2.5 h-2.5" /> : <FiArrowDown className="w-2.5 h-2.5" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm print:text-[9px]">
            {sortedProducts.map((item: ProductsStruct, index) => (
              <tr
                key={item._id}
                className={`border-b hover:bg-orange-50 transition-colors duration-200 print:border-b print:border-gray-300 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-2 py-1 print:px-1.5 print:py-0.5 text-center">
                  <Link
                    href={{
                      pathname: "/product",
                      query: { _id: item?._id },
                    }}
                    className="hover:text-orange-500 transition-colors print:text-gray-800 print:no-underline"
                  >
                    {item?._id}
                  </Link>
                </td>
                <td className="px-2 py-1 print:px-1.5 print:py-0.5">
                  <Link
                    href={{
                      pathname: "/product",
                      query: { _id: item?._id },
                    }}
                    className="print:no-underline"
                  >
                    <Image
                      src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
                      alt="product image"
                      width={32}
                      height={32}
                      className="rounded object-cover w-8 h-8 print:w-6 print:h-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/static/no_photo.webp';
                      }}
                    />
                  </Link>
                </td>
                <td className="px-2 py-1 print:px-1.5 print:py-0.5">
                  <Link
                    href={{
                      pathname: "/product",
                      query: { _id: item?._id },
                    }}
                    className="hover:text-orange-500 transition-colors print:text-gray-800 print:no-underline"
                  >
                    <span className="line-clamp-2">{item.title}</span>
                  </Link>
                </td>
                <td className="px-2 py-1 print:px-1.5 print:py-0.5">
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs print:bg-gray-50 print:px-1 print:py-0.5 print:text-[8px]">
                    {item?.cat_name || '-'}
                  </span>
                </td>
                <td className="px-2 py-1 print:px-1.5 print:py-0.5 text-center">
                  {item?.type || '-'}
                </td>
                <td className="px-2 py-1 print:px-1.5 print:py-0.5 text-right font-semibold text-orange-600 print:text-gray-900">
                  {formatPrice(item?.price || 0)}
                </td>
                <td className="px-2 py-1 print:px-1.5 print:py-0.5 text-right hidden lg:table-cell">
                  <span className={`px-1.5 py-0.5 rounded text-xs print:rounded-none print:px-0.5 print:py-0 print:text-[8px] ${
                    (item?.quantity || 0) > 0 
                      ? 'bg-green-100 text-green-700 print:bg-transparent print:text-gray-900' 
                      : 'bg-red-100 text-red-700 print:bg-transparent print:text-gray-400'
                  }`}>
                    {item?.quantity > 0 ? item.quantity : 'Нет'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceList;
// buklet/page.tsx - Оптимизированная для печати на 1 листе А4
"use client";

import React, { useState, useEffect, useMemo } from "react";
import PriceListGrouped from "@/components/PriceListGrouped";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";
import Image from "next/image";
import Menu from "@/components/Menu";
import { 
  FiPrinter, 
  FiSearch, 
  FiX,
  FiTruck,
  FiClock,
  FiAward,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { CONTACT } from "@/constants/text";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

interface GroupedProduct {
  groupName: string;
  products: ProductsStruct[];
  totalSum: number;
  firstImage: string;
  productCount: number;
}

const BukletPage: React.FC<PageProps> = ({ searchParams }) => {
  const unwrappedParams = React.use(searchParams as any) as any;
  const searchTerm = unwrappedParams?.search || "";
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Группировка продуктов
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, { products: ProductsStruct[], totalSum: number, firstImage: string }>();
    
    products.forEach(product => {
      const groupKey = product.cat_name || product.title.split(' ')[0].toLowerCase();
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          products: [],
          totalSum: 0,
          firstImage: product.image || 'no_photo.webp'
        });
      }
      
      const group = groups.get(groupKey)!;
      group.products.push(product);
      group.totalSum += product.price;
    });

    return Array.from(groups.entries())
      .map(([groupName, data]) => ({
        groupName: groupName.charAt(0).toUpperCase() + groupName.slice(1),
        products: data.products,
        totalSum: data.totalSum,
        firstImage: data.firstImage,
        productCount: data.products.length
      }))
      .sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [products]);

  // Фильтрация по поиску
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedProducts;
    
    const search = searchTerm.toLowerCase();
    return groupedProducts.filter(group => 
      group.products.some(product =>
        product.title.toLowerCase().includes(search) ||
        product.cat_name?.toLowerCase().includes(search) ||
        product.type?.toLowerCase().includes(search)
      )
    );
  }, [groupedProducts, searchTerm]);

  // Разделение на две колонки
  const halfIndex = Math.ceil(filteredGroups.length / 2);
  const leftGroups = filteredGroups.slice(0, halfIndex);
  const rightGroups = filteredGroups.slice(halfIndex);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Загрузка буклета...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <Menu />
      
      <div className="container mx-auto px-4 py-4 print:px-0 print:py-0 print:m-0 print:max-w-none">
        {/* ===== БУКЛЕТ ДЛЯ ПЕЧАТИ ===== */}
        <div id="buklet-print" className="print:block">
          {/* ===== ЗАГОЛОВОК ===== */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 print:bg-gray-800 print:from-gray-800 print:to-gray-800 rounded-2xl print:rounded-none shadow-lg print:shadow-none mb-4 print:mb-1 overflow-hidden">
            <div className="flex items-center justify-between p-4 print:p-2">
              <div className="text-white">
                <h1 className="text-xl md:text-2xl print:text-sm font-bold leading-tight">
                  Рязанская молочная ферма
                </h1>
                <p className="text-orange-100 print:text-gray-300 text-xs print:text-[8px]">
                  с. Заокское • Натуральная молочная продукция
                </p>
              </div>
              
              <div className="flex items-center gap-3 print:gap-1">
                <div className="text-white text-right print:text-gray-300">
                  <p className="text-xs print:text-[7px] opacity-80">Телефон</p>
                  <a 
                    href={`tel:${CONTACT.PHONE}`}
                    className="text-sm print:text-[9px] font-bold hover:underline"
                  >
                    {CONTACT.PHONE_FORMATTED}
                  </a>
                </div>
                
                <div className="w-12 h-12 print:w-10 print:h-10 bg-white rounded-lg p-0.5 print:p-0.5 shadow-lg">
                  <Image 
                    alt="QR" 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-contain" 
                    src="/static/qr-code-buklet.webp"
                  />
                </div>
              </div>
            </div>

            {/* Информационные карточки - компактные */}
            <div className="grid grid-cols-3 gap-2 px-4 pb-3 print:px-2 print:pb-1">
              <div className="flex items-center gap-1.5 print:gap-0.5 bg-white/10 print:bg-gray-700 rounded-lg px-2 py-1 print:px-1 print:py-0.5">
                <FiTruck className="w-3 h-3 print:w-2.5 print:h-2.5 text-white" />
                <span className="text-white print:text-gray-300 text-[10px] print:text-[6px] leading-tight">Бесплатная доставка</span>
              </div>
              <div className="flex items-center gap-1.5 print:gap-0.5 bg-white/10 print:bg-gray-700 rounded-lg px-2 py-1 print:px-1 print:py-0.5">
                <FiClock className="w-3 h-3 print:w-2.5 print:h-2.5 text-white" />
                <span className="text-white print:text-gray-300 text-[10px] print:text-[6px] leading-tight">Пн-Сб 08:00-18:00</span>
              </div>
              <div className="flex items-center gap-1.5 print:gap-0.5 bg-white/10 print:bg-gray-700 rounded-lg px-2 py-1 print:px-1 print:py-0.5">
                <FiAward className="w-3 h-3 print:w-2.5 print:h-2.5 text-white" />
                <span className="text-white print:text-gray-300 text-[10px] print:text-[6px] leading-tight">Вет. контроль</span>
              </div>
            </div>
          </div>

          {/* ===== ОСНОВНОЙ КОНТЕНТ - МАКСИМАЛЬНО КОМПАКТНЫЙ ===== */}
          {filteredGroups.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">По вашему запросу ничего не найдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 print:gap-0.5 print:grid-cols-2">
              {/* Левая колонка */}
              <div className="space-y-1 print:space-y-0">
                {leftGroups.map((group) => (
                  <PriceListGrouped 
                    key={group.groupName}
                    group={group}
                    searchTerm={searchTerm}
                    isExpanded={true}
                    onToggle={() => toggleGroup(group.groupName)}
                    isPrint={true}
                  />
                ))}
              </div>

              {/* Правая колонка */}
              <div className="space-y-1 print:space-y-0">
                {rightGroups.map((group) => (
                  <PriceListGrouped 
                    key={group.groupName}
                    group={group}
                    searchTerm={searchTerm}
                    isExpanded={true}
                    onToggle={() => toggleGroup(group.groupName)}
                    isPrint={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== ФУТЕР ===== */}
        <div className="mt-4 print:mt-0.5 pt-2 print:pt-0.5 border-t border-gray-200 print:border-gray-300 text-center text-xs print:text-[6px] text-gray-400 print:text-gray-500">
          <p>© {new Date().getFullYear()} Рязанская молочная ферма Заокское</p>
        </div>

        {/* ===== КНОПКИ УПРАВЛЕНИЯ (только на экране) ===== */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-2 print:hidden z-50">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <FiPrinter className="w-5 h-5" />
            Печать
          </button>
        </div>
      </div>

      {/* СТИЛИ ДЛЯ ПЕЧАТИ НА 1 ЛИСТЕ А4 */}
      <style jsx global>{`
        @media print {
          /* Сброс всех отступов */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          /* Контейнер буклета */
          #buklet-print {
            max-width: 100% !important;
            padding: 2mm !important;
            margin: 0 !important;
          }
          
          /* Скрываем все лишнее */
          header, nav, .no-print, .print\\:hidden {
            display: none !important;
          }
          
          /* Меню скрываем */
          .menu-container, nav, header:not(#buklet-print) {
            display: none !important;
          }
          
          /* Основной контент */
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Сетка в две колонки */
          .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1px !important;
          }
          
          /* Карточки групп */
          .group-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 2px !important;
            margin-bottom: 1px !important;
            padding: 0 !important;
          }
          
          /* Таблицы */
          table {
            font-size: 5px !important;
            line-height: 1.1 !important;
          }
          
          th, td {
            padding: 1px 2px !important;
            font-size: 5px !important;
            line-height: 1.1 !important;
          }
          
          /* Заголовки групп */
          .group-header {
            padding: 1px 4px !important;
            font-size: 6px !important;
            border-bottom: 1px solid #d1d5db !important;
          }
          
          /* Изображения */
          img {
            max-width: 20px !important;
            max-height: 20px !important;
          }
          
          /* Шрифты */
          h1, h2, h3, h4 {
            font-size: 8px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          p, span, div {
            font-size: 6px !important;
            line-height: 1.2 !important;
          }
          
          /* Цвета */
          .bg-white {
            background: white !important;
          }
          
          .bg-gray-50 {
            background: #f9fafb !important;
          }
          
          .text-gray-500, .text-gray-400 {
            color: #6b7280 !important;
          }
          
          .text-orange-500, .text-orange-600 {
            color: #1a1a1a !important;
          }
          
          /* Страница А4 */
          @page {
            size: A4 portrait;
            margin: 3mm 4mm !important;
          }
          
          /* Предотвращаем разрывы внутри групп */
          .group-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          
          /* Скрываем кнопки */
          button {
            display: none !important;
          }
          
          /* Убираем лишние отступы */
          .p-\\d+ {
            padding: 0 !important;
          }
          .m-\\d+ {
            margin: 0 !important;
          }
          .gap-\\d+ {
            gap: 0 !important;
          }
          .space-y-\\d+ {
            margin-top: 0 !important;
          }
          
          /* Принудительно показываем все группы */
          .group-expanded {
            display: block !important;
            max-height: none !important;
            overflow: visible !important;
          }
          
          /* Убираем анимации */
          .animate-fadeIn {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BukletPage;
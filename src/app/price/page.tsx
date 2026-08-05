// price/page.tsx - Упрощенная версия
"use client";

import PriceList from "@/components/PriceList";
import Container from "@/components/Container";
import Menu from "@/components/Menu";
import { useState, useRef, useEffect } from "react";
import { 
  FiSearch, 
  FiPrinter, 
  FiX,
  FiFileText
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { StateProps } from "../../../type";

const PricePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const priceListRef = useRef<HTMLDivElement>(null);
  
  const { productData } = useSelector((state: StateProps) => state?.shopping || { productData: [] });

  // ===== ОБРАБОТЧИК ПЕЧАТИ =====
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // ===== ПОДСЧЕТ НАЙДЕННЫХ ТОВАРОВ =====
  const getFilteredCount = () => {
    if (!productData || productData.length === 0) return 0;
    
    if (!searchTerm) return productData.length;
    
    const search = searchTerm.toLowerCase();
    return productData.filter((item: any) => {
      return (
        item.title?.toLowerCase().includes(search) ||
        item.cat_name?.toLowerCase().includes(search) ||
        item.ingredients?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        String(item._id).includes(search)
      );
    }).length;
  };

  const filteredCount = getFilteredCount();
  const totalCount = productData?.length || 0;

  // Добавляем стили печати в head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      <div id="price-page" className="min-h-screen bg-gray-50">
        <Menu />
        
        <Container>
          {/* ===== ЗАГОЛОВОК И УПРАВЛЕНИЕ ===== */}
          <div className="py-6 space-y-4 no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-3 rounded-xl text-white">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Прайс-лист
                  </h1>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? (
                      <>Найдено: <span className="font-semibold text-gray-700">{filteredCount}</span> из {totalCount} товаров</>
                    ) : (
                      <>{totalCount} товаров в наличии</>
                    )}
                  </p>
                </div>
              </div>

              {/* Кнопка печати */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm border border-gray-200 transition-colors"
              >
                <FiPrinter className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Печать</span>
              </button>
            </div>

            {/* ===== ПОИСК ===== */}
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по названию, категории, составу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ===== СПИСОК ТОВАРОВ ===== */}
          <div ref={priceListRef} className="pb-10">
            <PriceList searchTerm={searchTerm} />
          </div>
        </Container>
      </div>
    </>
  );
};

// ===== СТИЛИ ДЛЯ ПЕЧАТИ =====
const printStyles = `
  @media print {
    body * {
      visibility: hidden !important;
    }
    #price-page, #price-page * {
      visibility: visible !important;
    }
    #price-page {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      background: white !important;
      padding: 20px !important;
    }
    .no-print {
      display: none !important;
    }
    #price-page table {
      width: 100% !important;
      border-collapse: collapse !important;
    }
    #price-page th,
    #price-page td {
      border: 1px solid #ddd !important;
      padding: 4px 8px !important;
      text-align: left !important;
      font-size: 11px !important;
    }
    #price-page th {
      background-color: #f5f5f5 !important;
      font-weight: 600 !important;
    }
    #price-page tr:nth-child(even) {
      background-color: #fafafa !important;
    }
  }
`;

export default PricePage;
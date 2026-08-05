// src/app/price/page.tsx

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
import { CONTACT, TEXT } from "@/constants/text";

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

  return (
    <>
      <div id="price-page" className="min-h-screen bg-gray-50">
        <Menu />
        
        <Container>
          {/* ===== ЗАГОЛОВОК ДЛЯ ПЕЧАТИ ===== */}
          <div className="print-header-only">
            <div className="print-header-content">
              <div className="print-company-info">
                <div className="print-company-name">{TEXT.TITLE}</div>
                <div className="print-company-slogan">{TEXT.SLOGAN}</div>
              </div>
              <div className="print-company-contacts">
                <div className="print-contact-item">
                  <span className="print-contact-label">Телефон:</span>
                  <span className="print-contact-value">{CONTACT.PHONE_FORMATTED}</span>
                </div>
                <div className="print-contact-item">
                  <span className="print-contact-label">Email:</span>
                  <span className="print-contact-value">{CONTACT.EMAIL}</span>
                </div>
                <div className="print-contact-item">
                  <span className="print-contact-label">Доставка:</span>
                  <span className="print-contact-value">Пн, Вт, Чт, Пт, Сб</span>
                </div>
              </div>
            </div>
            <div className="print-date">
              Прайс-лист от {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          </div>

          {/* ===== УПРАВЛЕНИЕ (только на экране) ===== */}
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

          {/* ===== ФУТЕР ДЛЯ ПЕЧАТИ ===== */}
          <div className="print-footer-only">
            Рязанская молочная ферма «Заокское» © {new Date().getFullYear()} · Все права защищены
          </div>
        </Container>
      </div>

      <style jsx global>{`
        /* Скрываем на экране */
        .print-header-only {
          display: none !important;
        }
        .print-footer-only {
          display: none !important;
        }

        @media print {
          /* Сброс */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Скрываем всё лишнее */
          body * {
            visibility: hidden !important;
          }
          
          /* Показываем только контент прайса */
          #price-page, 
          #price-page * {
            visibility: visible !important;
          }
          
          #price-page {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            padding: 0.5cm 0.8cm !important;
            font-size: 8pt !important;
          }
          
          /* Скрываем меню и управление */
          header, 
          nav, 
          .fixed, 
          .menu, 
          .no-print,
          .screen-only {
            display: none !important;
          }
          
          /* Показываем заголовок для печати */
          .print-header-only {
            display: block !important;
            border-bottom: 2px solid #1a1a1a !important;
            padding-bottom: 5px !important;
            margin-bottom: 6px !important;
            page-break-after: avoid !important;
          }
          
          .print-header-content {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            gap: 10px !important;
            align-items: center !important;
          }
          
          .print-company-info {
            display: flex !important;
            flex-direction: column !important;
            gap: 1px !important;
          }
          
          .print-company-name {
            font-size: 11pt !important;
            font-weight: 700 !important;
            color: #1a1a1a !important;
            margin: 0 !important;
            letter-spacing: 0.3px !important;
          }
          
          .print-company-slogan {
            font-size: 6.5pt !important;
            color: #4b5563 !important;
            margin: 0 !important;
          }
          
          .print-company-contacts {
            display: flex !important;
            flex-direction: column !important;
            gap: 1px !important;
            font-size: 6.5pt !important;
            text-align: right !important;
            justify-content: center !important;
          }
          
          .print-contact-item {
            display: flex !important;
            gap: 4px !important;
            justify-content: flex-end !important;
          }
          
          .print-contact-label {
            color: #6b7280 !important;
          }
          
          .print-contact-value {
            font-weight: 600 !important;
            color: #1a1a1a !important;
          }
          
          .print-date {
            font-size: 6pt !important;
            color: #6b7280 !important;
            text-align: center !important;
            margin-top: 2px !important;
            padding-top: 2px !important;
            border-top: 1px solid #e5e7eb !important;
          }
          
          /* Показываем футер */
          .print-footer-only {
            display: block !important;
            text-align: center !important;
            font-size: 5pt !important;
            color: #9ca3af !important;
            border-top: 1px solid #e5e7eb !important;
            padding-top: 3px !important;
            margin-top: 6px !important;
          }
          
          /* Таблица */
          #price-page table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 7pt !important;
          }
          
          #price-page th,
          #price-page td {
            border: 1px solid #d1d5db !important;
            padding: 2px 5px !important;
            text-align: left !important;
            font-size: 7pt !important;
            line-height: 1.2 !important;
          }
          
          #price-page th {
            background-color: #f3f4f6 !important;
            font-weight: 700 !important;
            font-size: 7pt !important;
          }
          
          #price-page td {
            padding: 2px 5px !important;
          }
          
          #price-page tr {
            page-break-inside: avoid !important;
          }
          
          #price-page .container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          
          ::-webkit-scrollbar {
            display: none !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 0.6cm 0.8cm;
          }
        }
      `}</style>
    </>
  );
};

export default PricePage;
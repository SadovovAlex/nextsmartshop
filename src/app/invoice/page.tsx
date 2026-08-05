// src/app/invoice/page.tsx
"use client";

import React, { useEffect } from "react";
import InvoiceList from "@/components/InvoiceList";
import Container from "@/components/Container";
import Menu from "@/components/Menu";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import { motion } from "framer-motion";

const InvoicePage = () => {
  // Добавляем стили для печати
  useEffect(() => {
    const printStyles = `
      @media print {
        /* Скрываем все элементы на странице */
        body * {
          visibility: hidden !important;
        }
        
        /* Показываем только содержимое накладной */
        #invoice-print-content, 
        #invoice-print-content * {
          visibility: visible !important;
        }
        
        #invoice-print-content {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          padding: 10px !important;
          background: white !important;
        }
        
        /* Скрываем меню и футер */
        nav, 
        .menu, 
        [class*="menu"], 
        [class*="Menu"],
        header,
        footer,
        .footer,
        .no-print {
          display: none !important;
        }
        
        /* Стили для таблицы */
        table {
          page-break-inside: avoid !important;
          width: 100% !important;
        }
        
        tr {
          page-break-inside: avoid !important;
        }
        
        /* Стили для печати */
        .print\\:block {
          display: block !important;
        }
        
        .print\\:hidden {
          display: none !important;
        }
        
        .print\\:shadow-none {
          box-shadow: none !important;
        }
        
        .print\\:border {
          border: 1px solid #d1d5db !important;
        }
        
        .print\\:text-black {
          color: black !important;
        }
        
        .print\\:no-underline {
          text-decoration: none !important;
        }
        
        /* Размер страницы */
        @page {
          size: A4 portrait;
          margin: 0.5cm !important;
        }
        
        /* Убираем лишние отступы */
        .container {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    `;

    // Создаем и добавляем стили
    const styleElement = document.createElement('style');
    styleElement.id = 'invoice-print-styles';
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);

    return () => {
      const style = document.getElementById('invoice-print-styles');
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <Menu />
      
      <Container className="py-4 print:py-0">
        <AdminRouteGuard redirectPath="/invoice">
          {/* Анимация появления */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            id="invoice-print-content"
          >
            <InvoiceList />
          </motion.div>
        </AdminRouteGuard>
      </Container>
    </div>
  );
};

export default InvoicePage;
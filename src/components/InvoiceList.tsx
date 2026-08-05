// src/components/InvoiceList.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../type";
import Link from "next/link";
import { CONTACT } from "../constants/text";
import { 
  FiPrinter, 
  FiDownload, 
  FiFileText, 
  FiUser, 
  FiMapPin, 
  FiPhone,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { motion } from "framer-motion";

interface InvoiceItem {
  product: ProductsStruct;
  quantity: number;
  total: number;
}

const InvoiceList: React.FC = () => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        
        // Инициализируем товары с количеством 0
        const initialItems = fetchedProducts.map(p => ({
          product: p,
          quantity: 0,
          total: 0
        }));
        setInvoiceItems(initialItems);
        
        // Генерируем номер накладной
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        setInvoiceNumber(`ИНВ-${dateStr}`);
        setInvoiceDate(today.toLocaleDateString('ru-RU'));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Обновление количества
  const updateQuantity = (index: number, quantity: number) => {
    const newItems = [...invoiceItems];
    const item = newItems[index];
    const qty = Math.max(0, quantity);
    item.quantity = qty;
    item.total = qty * item.product.price;
    setInvoiceItems(newItems);
  };

  // Подсчет итогов
  const calculateTotals = () => {
    const totalItems = invoiceItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    return { totalItems, totalAmount };
  };

  const { totalItems, totalAmount } = calculateTotals();

  // Только товары с количеством > 0
  const activeItems = invoiceItems.filter(item => item.quantity > 0);

  // Печать
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Экспорт в CSV
  const handleExportCSV = () => {
    if (activeItems.length === 0) {
      alert("Нет товаров для экспорта");
      return;
    }

    const headers = ['№', 'Наименование', 'Ед.изм.', 'Кол-во', 'Цена', 'Сумма'];
    const rows = activeItems.map((item, index) => [
      index + 1,
      item.product.title,
      item.product.type || 'шт',
      item.quantity,
      item.product.price,
      item.total
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `накладная_${invoiceNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="invoice-container min-h-screen bg-gray-50 print:bg-white">
      {/* ===== УПРАВЛЕНИЕ ===== */}
      <div className="bg-white border-b border-gray-200 print:hidden sticky top-16 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Накладная</h1>
              <p className="text-xs text-gray-500">{invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-md"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Печать</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={activeItems.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Экспорт</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== НАКЛАДНАЯ ===== */}
      <div className="container mx-auto px-4 py-6 print:px-0 print:py-0">
        <div 
          ref={invoiceRef}
          className="bg-white rounded-2xl shadow-lg print:shadow-none overflow-hidden print:rounded-none"
        >
          {/* Header накладной */}
          <div className="p-6 print:p-4 border-b border-gray-200 print:border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Левая часть */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-600">Накладная №</span>
                  <span className="font-bold text-gray-800">{invoiceNumber}</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold text-gray-600">от</span>
                  <span className="font-bold text-gray-800">{invoiceDate}</span>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <FiUser className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-600">Грузополучатель:</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Наименование организации / ИП"
                      className="ml-2 px-2 py-0.5 border-b border-dashed border-gray-300 focus:border-orange-500 focus:outline-none min-w-[200px] bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-600">Адрес доставки:</span>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Город, улица, дом"
                      className="ml-2 px-2 py-0.5 border-b border-dashed border-gray-300 focus:border-orange-500 focus:outline-none min-w-[250px] bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Правая часть */}
              <div className="text-right">
                <div className="font-semibold text-gray-800">Грузоотправитель</div>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Рязанская молочная ферма Заокское</p>
                  <p className="flex items-center justify-end gap-2">
                    <FiPhone className="w-3 h-3" />
                    {CONTACT.PHONE_FORMATTED}
                  </p>
                  <p className="text-xs text-gray-400">ИНН 1234567890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Таблица товаров */}
          <div className="overflow-x-auto p-4 print:p-0">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 print:bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 print:px-2 print:py-1">№</th>
                  <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 print:px-2 print:py-1">Наименование</th>
                  <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 print:px-2 print:py-1">Ед.изм.</th>
                  <th className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600 print:px-2 print:py-1">Кол-во</th>
                  <th className="border border-gray-200 px-3 py-2 text-right text-xs font-semibold text-gray-600 print:px-2 print:py-1">Цена</th>
                  <th className="border border-gray-200 px-3 py-2 text-right text-xs font-semibold text-gray-600 print:px-2 print:py-1">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => {
                  const invoiceItem = invoiceItems[index];
                  return (
                    <tr 
                      key={item._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500 print:px-2 print:py-1">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 print:px-2 print:py-1">
                        <Link
                          href={{
                            pathname: "/product",
                            query: { _id: item._id },
                          }}
                          className="text-blue-600 hover:underline print:text-black print:no-underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500 print:px-2 print:py-1">
                        {item.type || 'шт'}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-center print:px-2 print:py-1">
                        <input
                          type="number"
                          min="0"
                          value={invoiceItem?.quantity || 0}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent print:border-none"
                          placeholder="0"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-sm font-medium print:px-2 print:py-1">
                        {item.price} ₽
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-right font-semibold text-orange-600 print:px-2 print:py-1">
                        {invoiceItem?.total ? `${invoiceItem.total} ₽` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 print:bg-gray-100 font-semibold">
                  <td colSpan={3} className="border border-gray-200 px-3 py-3 print:px-2 print:py-1">
                    <div className="flex items-center gap-4">
                      <span>Итого:</span>
                      <span className="text-sm font-normal text-gray-500">
                        {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                      </span>
                    </div>
                  </td>
                  <td colSpan={2} className="border border-gray-200 px-3 py-3 text-right print:px-2 print:py-1">
                    <span className="text-sm font-normal text-gray-500">Общая сумма:</span>
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-right text-lg font-bold text-orange-600 print:px-2 print:py-1">
                    {totalAmount} ₽
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Комментарий */}
          <div className="p-4 border-t border-gray-200 print:border-gray-300">
            <div className="flex items-start gap-2 text-sm">
              <span className="font-semibold text-gray-600">Комментарий:</span>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительная информация"
                className="flex-1 px-2 py-0.5 border-b border-dashed border-gray-300 focus:border-orange-500 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Подписи */}
          <div className="grid grid-cols-2 gap-8 p-6 print:p-4 border-t border-gray-200 print:border-gray-300">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Грузоотправитель</p>
              <div className="h-0.5 w-48 bg-gray-300"></div>
              <p className="text-xs text-gray-400">(подпись)</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-sm font-semibold text-gray-600">Грузополучатель</p>
              <div className="h-0.5 w-48 bg-gray-300 ml-auto"></div>
              <p className="text-xs text-gray-400">(подпись)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Стили для печати */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:px-2 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          .print\\:py-1 {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:no-underline {
            text-decoration: none !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          input {
            border: none !important;
            background: transparent !important;
          }
          input:focus {
            outline: none !important;
            ring: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceList;
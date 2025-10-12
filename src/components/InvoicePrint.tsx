import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductsStruct } from "../../type";
import { CONTACT } from "../constants/text";

const InvoicePrint: React.FC = () => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      
      // Calculate total amount
      const total = fetchedProducts.reduce((sum: number, product: ProductsStruct) => sum + product.price, 0);
      setTotalAmount(total);
      
      // Generate invoice number
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      setInvoiceNumber(`INV-${dateStr.replace(/-/g, '')}`);
    };

    fetchProducts();
  }, []);

  return (
    <div className="">
      <div className="bg-white p-8 border rounded-lg">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="text-lg font-semibold mb-2">
              Накладная №<span className="border-b-2 border-dotted border-gray-400 px-1">{invoiceNumber}</span> от ____.____2025
            </div>
            <div className="mb-2">
              Грузополучатель <span className="border-b-2 border-dotted border-gray-400 px-1">_____________________________________________________</span>
            </div>
            <div className="mb-2">
              Адрес доставки <span className="border-b-2 border-dotted border-gray-400 px-1">______________________________________________________</span>
            </div>
            <div className="mb-4">
              Комментарий <span className="border-b-2 border-dotted border-gray-400 px-1">_________________________________________________________</span>
            </div>_
          </div>

          <div className="flex-1 text-right">
            <div className="text-base font-semibold mb-2">
              Грузоотправитель
            </div>
            <div className="mb-2">
              Рязанская Молочная Продукция (ферма)
            </div>
            <div>
              Телефон: {CONTACT.PHONE_FORMATTED}
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Image
              src="/static/logo.webp"
              alt="Логотип"
              className="w-32 h-32 object-contain"
              width={200}
              height={200}
            />
          </div>
    
          {/* Print Styles */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              .print, .print * {
                visibility: visible !important;
              }
              .print {
                position: static !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }
              .print .bg-white {
                background: white !important;
              }
              .print .border {
                border: 1px solid #ccc !important;
              }
              .print .border-collapse {
                border-collapse: collapse !important;
              }
              .print .w-full {
                width: 100% !important;
              }
              .print .overflow-x-auto {
                overflow-x: visible !important;
              }
              /* Hide site title and date/time when printing */
              .print .site-title,
              .print .date-time,
              .print .header,
              .print .footer,
              .print .layout {
                display: none !important;
              }
              @page {
                margin: 1cm;
              }
            }
          `}</style>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">№</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Наименование</th>
                <th className="border border-gray-300 px-4 py-2 text-left">заказ</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Категория</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Ед.изм.</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Кол-во</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Цена</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item: ProductsStruct, index) => (
                <tr key={item._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2">{item.cat_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{item.price} ₽</td>
                  <td className="border border-gray-300 px-4 py-2 text-right"></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right">Итого:</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{totalAmount} ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Information */}
        <div className="mt-8 pt-4 border-t border-gray-300">
          <div className="text-sm text-gray-600 mb-2">
            Работаем с розничными магазинами, сетями и продуктовыми рынками.
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Опт на выгодных условиях.
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Ветеринарное свидетельство отправляем по Меркурию.
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Бесплатная доставка в Москву, Московскую область, Тула(область), Калуга(область), Липецк(область), при определенной сумме заказа.
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Дни доставки: пн, вт, чт, пт, сб.
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Адрес: Россия, 390019, Рязанская обл., село Заокское.
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Прием заказов: 8:00 - 10:00 ежедневно
          </div>
          <div className="text-xs text-gray-500 mt-4">
            © 2025 WR Shop. All rights reserved. WR App v0.1.69
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
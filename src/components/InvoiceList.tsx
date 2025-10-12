import { getProducts } from "@/helpers";
import React, { useEffect, useState } from "react";
import { ProductsStruct } from "../../type";
import Link from "next/link";
import { CONTACT } from "../constants/text";
import InvoicePrint from "./InvoicePrint";

const InvoiceList: React.FC = () => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      
      // Generate invoice number
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      setInvoiceNumber(`INV-${dateStr.replace(/-/g, '')}`);
    };

    fetchProducts();
  }, []);

  const handlePrint = () => {
    // Force a re-render to ensure print styles are applied
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="invoice-container">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrint}
          className="print-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Печать
        </button>
      </div>

      <div className="bg-white p-8 border rounded-lg print:p-4">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="text-lg font-semibold mb-2">
              Накладная №<span className="border-b-2 border-dotted border-gray-400 px-1">________</span>от ____.____.2025
            </div>
            <div className="mb-2">
              Грузополучатель <span className="border-b-2 border-dotted border-gray-400 px-1">_______________________________________________</span>
            </div>
            <div className="mb-2">
              Адрес доставки <span className="border-b-2 border-dotted border-gray-400 px-1">__________________________________________________</span>
            </div>
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

        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left print:px-2 print:py-1 print:text-xs">№</th>
                <th className="border border-gray-300 px-4 py-2 text-left print:px-2 print:py-1 print:text-xs">Наименование</th>
                <th className="border border-gray-300 px-4 py-2 text-left print:px-2 print:py-1 print:text-xs">заказ</th>
                <th className="border border-gray-300 px-4 py-2 text-left print:px-2 print:py-1 print:text-xs">Ед.изм.</th>
                <th className="border border-gray-300 px-4 py-2 text-left print:px-2 print:py-1 print:text-xs">Кол-во</th>
                <th className="border border-gray-300 px-4 py-2 text-right print:px-2 print:py-1 print:text-xs">Цена</th>
                <th className="border border-gray-300 px-4 py-2 text-right print:px-2 print:py-1 print:text-xs">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item: ProductsStruct, index) => (
                <tr key={item._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 px-4 py-2 print:px-2 print:py-1 print:text-xs">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 print:px-2 print:py-1 print:text-xs">
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
                  <td className="border border-gray-300 px-4 py-2 print:px-2 print:py-1 print:text-xs"></td>
                  <td className="border border-gray-300 px-4 py-2 print:px-2 print:py-1 print:text-xs">{item.type}</td>
                  <td className="border border-gray-300 px-4 py-2 print:px-2 print:py-1 print:text-xs"></td>
                  <td className="border border-gray-300 px-4 py-2 text-right print:px-2 print:py-1 print:text-xs">{item.price} ₽</td>
                  <td className="border border-gray-300 px-4 py-2 text-right print:px-2 print:py-1 print:text-xs"></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={6} className="border border-gray-300 px-4 py-2 text-right print:px-2 print:py-1 print:text-xs">Итого:</td>
                <td className="border border-gray-300 px-4 py-2 text-right print:px-2 print:py-1 print:text-xs">______ ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

   
    </div>
  );
};

export default InvoiceList;
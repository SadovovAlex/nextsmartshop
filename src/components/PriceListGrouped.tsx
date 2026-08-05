// PriceListGrouped.tsx - Оптимизированная для печати
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductsStruct } from "../../type";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface PriceListGroupedProps {
  group: {
    groupName: string;
    products: ProductsStruct[];
    totalSum: number;
    firstImage: string;
    productCount: number;
  };
  searchTerm: string;
  isExpanded: boolean;
  onToggle: () => void;
  isPrint?: boolean;
}

const PriceListGrouped: React.FC<PriceListGroupedProps> = ({ 
  group, 
  searchTerm, 
  isExpanded,
  onToggle,
  isPrint = false
}) => {
  const filteredProducts = searchTerm 
    ? group.products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cat_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : group.products;

  if (filteredProducts.length === 0) return null;

  const formatPrice = (price: number): string => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className={`bg-white rounded-xl print:rounded-none shadow-lg print:shadow-none border print:border border-gray-100 print:border-gray-300 overflow-hidden group-card ${isPrint ? 'print:mb-0.5' : ''}`}>
      {/* Заголовок группы */}
      <div 
        className={`flex items-center justify-between px-3 py-1.5 print:px-1 print:py-0.5 cursor-pointer hover:bg-gray-50 transition-colors group-header ${
          isPrint ? 'print:cursor-default print:hover:bg-transparent' : ''
        }`}
        onClick={!isPrint ? onToggle : undefined}
      >
        <div className="flex items-center gap-2 print:gap-0.5 min-w-0">
          {!isPrint && (
            <div className="w-8 h-8 print:w-5 print:h-5 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              <Image
                src={`/static/products/${group.firstImage}`}
                alt={group.groupName}
                width={32}
                height={32}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/static/no_photo.webp';
                }}
              />
            </div>
          )}
          
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm print:text-[7px] leading-tight truncate">
              {group.groupName}
            </h3>
            <div className="flex items-center gap-2 text-xs print:text-[5px] text-gray-500">
              <span>{filteredProducts.length} товаров</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline font-medium text-orange-500 print:text-gray-700">
                {formatPrice(group.totalSum)} ₽
              </span>
            </div>
          </div>
        </div>

        {!isPrint && (
          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-xs">
              {isExpanded ? 'Скрыть' : 'Показать'}
            </span>
            {isExpanded ? (
              <FiChevronUp className="w-3.5 h-3.5" />
            ) : (
              <FiChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        )}
      </div>

      {/* Список продуктов */}
      {(isExpanded || isPrint) && (
        <div className="border-t border-gray-100 print:border-t print:border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-xs print:text-[5px]">
              <thead>
                <tr className="bg-gray-50 print:bg-gray-100">
                  <th className="px-2 py-1 print:px-1 print:py-0.5 text-left font-semibold text-gray-500 print:text-gray-600">№</th>
                  <th className="px-2 py-1 print:px-1 print:py-0.5 text-left font-semibold text-gray-500 print:text-gray-600">Наименование</th>
                  <th className="px-2 py-1 print:px-1 print:py-0.5 text-left font-semibold text-gray-500 print:text-gray-600 hidden md:table-cell">Категория</th>
                  <th className="px-2 py-1 print:px-1 print:py-0.5 text-left font-semibold text-gray-500 print:text-gray-600">Ед.</th>
                  <th className="px-2 py-1 print:px-1 print:py-0.5 text-right font-semibold text-gray-500 print:text-gray-600">Цена</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 print:divide-gray-300">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product._id}
                    className="hover:bg-orange-50 transition-colors print:hover:bg-transparent"
                  >
                    <td className="px-2 py-1 print:px-1 print:py-0.5 text-gray-500">
                      {product._id}
                    </td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5">
                      {isPrint ? (
                        <span className="text-gray-800">{product.title}</span>
                      ) : (
                        <Link
                          href={{
                            pathname: "/product",
                            query: { _id: product._id },
                          }}
                          className="hover:text-orange-500 transition-colors print:text-gray-800 print:no-underline"
                        >
                          {product.title}
                        </Link>
                      )}
                    </td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5 text-gray-500 hidden md:table-cell">
                      {product.cat_name || '-'}
                    </td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5 text-gray-500">
                      {product.type || '-'}
                    </td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5 text-right font-semibold text-orange-600 print:text-gray-800">
                      {formatPrice(product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceListGrouped;
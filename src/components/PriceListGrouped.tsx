"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductsStruct } from "../../type";

interface PriceListGroupedProps {
  groupedProducts: {
    groupName: string;
    products: ProductsStruct[];
    totalSum: number;
    firstImage: string;
  }[];
  searchTerm: string;
}

const PriceListGrouped: React.FC<PriceListGroupedProps> = ({ groupedProducts, searchTerm }) => {
  // Filter groups based on search term
  const filteredGroups = groupedProducts.filter(group => {
    const isMatch = group.products.some((product: ProductsStruct) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return isMatch;
  });

  return (
    <div className="w-full">
      {filteredGroups.map((group) => (
        <div key={group.groupName} className="mb-6 border-b pb-6 print:border-b-2 print:border-black print:pb-4">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 mr-4 flex-shrink-0">
              <Image
                src={`/static/products/${group.firstImage}`}
                alt={`${group.groupName} image`}
                width={64}
                height={64}
                className="rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{group.groupName}</h3>
              {/* <p className="text-sm text-gray-600">{group.products.length} товаров</p> */}
              {/* <p className="text-lg font-bold text-green-600">Итого: {group.totalSum} ₽</p> */}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              {/* <thead>
                <tr className="bg-gray-200 print:bg-transparent">
                  <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs print:font-normal">№</th>
                  <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs print:font-normal">Наименование</th>
                  <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs print:font-normal">Категория</th>
                  <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs print:font-normal">Ед.изм.</th>
                  <th className="px-2 py-1 text-left print:px-1 print:py-0.5 print:text-xs print:font-normal">Цена,₽</th>
                </tr>
              </thead> */}
              <tbody className="text-xs print:text-xs">
                {group.products.map((product: ProductsStruct, index: number) => (
                  <tr
                    key={product._id}
                    className={`border-b hover:bg-green-100 transition-colors duration-300 print:border-b print:border-gray-300 print:hover:bg-transparent print:bg-transparent ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="px-2 py-1 print:px-1 print:py-0.5">{product._id}</td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5">
                      <Link
                        href={{
                          pathname: "/product",
                          query: { _id: product._id },
                        }}
                        className="hover:text-green-600"
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5">{product.cat_name}</td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5">{product.type}</td>
                    <td className="px-2 py-1 print:px-1 print:py-0.5">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      
      {filteredGroups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Товары не найдены
        </div>
      )}
    </div>
  );
};

export default PriceListGrouped;
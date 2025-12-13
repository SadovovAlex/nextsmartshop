"use client";

import React, { useState, useEffect } from "react";
import PriceListGrouped from "@/components/PriceListGrouped";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";

interface PageProps {
  searchParams: {
    search?: string;
  };
}

interface GroupedProduct {
  groupName: string;
  products: ProductsStruct[];
  totalSum: number;
  firstImage: string;
}

const Price4Page: React.FC<PageProps> = ({ searchParams }) => {
  const unwrappedParams = React.use(searchParams as any) as any;
  const searchTerm = unwrappedParams?.search || "";
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);

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

  useEffect(() => {
    // Group products by first word of title
    const groups = new Map<string, ProductsStruct[]>();
    
    products.forEach(product => {
      const firstWord = product.title.split(' ')[0].toLowerCase();
      if (!groups.has(firstWord)) {
        groups.set(firstWord, []);
      }
      groups.get(firstWord)!.push(product);
    });

    // Calculate totals and create grouped structure
    const grouped = Array.from(groups.entries()).map(([groupName, products]) => {
      const totalSum = products.reduce((sum, product) => sum + product.price, 0);
      const firstImage = products[0]?.image || 'no_photo.webp';
      
      return {
        groupName: groupName.charAt(0).toUpperCase() + groupName.slice(1),
        products: products,
        totalSum,
        firstImage
      };
    });

    // Sort groups by cat_priority first, then alphabetically by groupName
    grouped.sort((a: any, b: any) => {
      // Sort by cat_priority first (null/undefined values go last), then by groupName
      if (a.products[0]?.cat_priority && b.products[0]?.cat_priority) {
        return a.products[0].cat_priority - b.products[0].cat_priority;
      } else if (a.products[0]?.cat_priority && !b.products[0]?.cat_priority) {
        return -1;
      } else if (!a.products[0]?.cat_priority && b.products[0]?.cat_priority) {
        return 1;
      } else {
        return a.groupName.localeCompare(b.groupName);
      }
    });
    setGroupedProducts(grouped);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка буклета...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="container mx-auto px-4 py-8">
      
        <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent mb-8">
          <div className="p-6 border-b print:border-b-2 print:border-black">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Рязанская молочная ферма Заокское</h2>
                <p className="text-gray-600">Работаем с розничными магазинами, сетями и продуктовыми рынками.</p>
                   <p>Телефон для заказа: <span className="font-semibold">+7 (930) 888-76-78</span></p>
                  <p>Email: <span className="font-semibold">ryazantvorog@gmail.com</span></p>
            
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-28 h-28">
                  <img
                    alt="QR код"
                    loading="lazy"
                    width="112"
                    height="112"
                    decoding="async"
                    className="w-full h-full transition-transform duration-200 transform hover:scale-110"
                    style={{color: 'transparent'}}
                    src="/static/qr-code.webp"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">Узнай больше</p>
                </div>
              </div>
            </div>
             
          </div>
          <div className="p-6">
          <div className="p-6 border-b print:border-b-2 print:border-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Доставка</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Бесплатная доставка в Москву, Московскую область</li>
                  <li>• Тулу, Калугу, Липецк</li>
                  <li>• а так же область</li>
                  <li>• При определенной сумме заказа</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Контакты</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Дни доставки: пн, вт, чт, пт, сб</li>
                  <li>• Ветеринарное свидетельство отправляем по Меркурию</li>
                  <li>• Опт на выгодных условиях</li>
                  <li>• Доставка до магазина</li>
                        </ul>
              </div>
            </div>
          </div>
          </div>   
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-0">
          <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent">
           
            <div className="p-4">
              <PriceListGrouped 
                groupedProducts={groupedProducts.slice(0, Math.ceil(groupedProducts.length / 2))}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent">
            
            <div className="p-4">
              <PriceListGrouped 
                groupedProducts={groupedProducts.slice(Math.ceil(groupedProducts.length / 2))}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .print\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\:border-b-2 {
            border-bottom-width: 2px !important;
          }
          
          .print\:border-black {
            border-color: black !important;
          }
          
          .print\:grid-cols-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          
          .print\:gap-0 {
            gap: 0 !important;
          }
          
          /* Ensure proper page break behavior */
          @page {
            size: A4 portrait;
            margin: 0.5cm;
          }
          
          /* Hide unnecessary elements when printing */
          header, footer, nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Price4Page;
'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/helpers';
import { ProductsStruct } from '../../../../type';
import Image from 'next/image';

export default function OptPrintPage() {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="print-container">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .print-container {
            padding: 0;
          }
          
          .print-header {
            break-before: avoid;
          }
          
          .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            page-break-inside: avoid;
          }
          
          .product-card {
            break-inside: avoid;
            page-break-inside: avoid;
            height: auto;
          }
          
          .product-image {
            height: 100px !important;
          }
          
          .product-title {
            font-size: 11px !important;
            max-height: 32px !important;
          }
          
          .product-ingredients {
            font-size: 9px !important;
            max-height: 28px !important;
          }
          
          .product-category {
            font-size: 9px !important;
          }
          
          .product-price {
            font-size: 11px !important;
          }
          
          .product-id {
            font-size: 8px !important;
          }
        }
      `}</style>

      <div className="print-header text-center mb-4">
        <h1 className="text-2xl font-bold">Каталог товаров (Оптовая цена)</h1>
        <p className="text-sm text-gray-600">Распечатано {new Date().toLocaleDateString('ru-RU')}</p>
      </div>

      <div className="product-grid">
        {products.map((item: ProductsStruct) => (
          <div key={item._id} className="product-card border border-gray-300 rounded-lg overflow-hidden">
            <div className="product-image w-full bg-gray-100">
              <Image
                src={item.image ? `/static/products/${item.image}` : '/static/no_photo.webp'}
                alt={item.title}
                width={200}
                height={100}
                className="w-full h-24 object-cover"
              />
            </div>
            <div className="p-2">
              <div className="product-title font-semibold line-clamp-2">
                Арт. {item._id} {item.title}
              </div>
              <div className="product-category text-gray-600">
                {item.cat_name}
              </div>
              <div className="product-ingredients text-gray-700 line-clamp-2">
                {item.ingredients || "Состав не указан"}
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="product-price font-bold">
                  {item.price} ₽
                </div>
                <div className="product-id text-gray-500">
                  ID: {item._id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4 text-xs text-gray-500 print:hidden">
        Для печати нажмите Ctrl+P
      </div>
    </div>
  );
}
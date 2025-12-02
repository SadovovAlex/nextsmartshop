'use client';

import React from 'react';
import ProductsOpt from '@/components/ProductsOpt';
import { getProducts } from '@/helpers';
import { ProductsStruct } from '../../../type';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function OptPage() {
  const handleExportToPDF = async () => {
    try {
      const products = await getProducts();
      
      // Формируем содержимое PDF
      const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Каталог товаров (Оптовая цена)</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
        }
        .header h1 {
            font-size: 20px;
            margin: 0;
            color: #333;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }
        .product-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        .product-image {
            width: 100%;
            height: 120px;
            object-fit: cover;
            background-color: #f5f5f5;
        }
        .product-content {
            padding: 8px;
        }
        .product-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 4px;
            line-height: 1.2;
            max-height: 36px;
            overflow: hidden;
        }
        .product-category {
            font-size: 10px;
            color: #666;
            margin-bottom: 4px;
        }
        .product-ingredients {
            font-size: 10px;
            color: #444;
            margin-bottom: 6px;
            max-height: 30px;
            overflow: hidden;
        }
        .product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
        }
        .product-price {
            font-weight: bold;
            font-size: 12px;
            color: #000;
        }
        .product-id {
            font-size: 9px;
            color: #888;
        }
        @media print {
            .grid {
                gap: 10px;
            }
            .product-card {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Каталог товаров (Оптовая цена)</h1>
    </div>
    <div class="grid">
        ${products.map((product: ProductsStruct) => `
            <div class="product-card">
                <img src="${product.image ? '/static/products/' + product.image : '/static/no_photo.webp'}" alt="${product.title}" class="product-image">
                <div class="product-content">
                    <div class="product-title">Арт. ${product._id} ${product.title}</div>
                    <div class="product-category">${product.cat_name}</div>
                    <div class="product-ingredients">${product.ingredients || 'Состав не указан'}</div>
                    <div class="product-footer">
                        <div class="product-price">${product.price} ₽</div>
                        <div class="product-id">ID: ${product._id}</div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>
      `;

      // Создаем Blob с HTML содержимым
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Открываем в новой вкладке для печати
      window.open(url, '_blank');
      
      toast.success('PDF файл открыт в новой вкладке');
    } catch (error) {
      console.error('Ошибка при экспорте в PDF:', error);
      toast.error('Ошибка при экспорте в PDF');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Каталог товаров (Оптовая цена)</h1>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="bg-green-600 px-4 py-2 text-sm tracking-wide rounded-full text-white hover:bg-green-700 duration-200 noprint"
            >
              Печать каталога
            </button>
            <Link
              href="/opt/print"
              target="_blank"
              className="bg-emerald-600 px-4 py-2 text-sm tracking-wide rounded-full text-white hover:bg-emerald-700 duration-200 noprint"
            >
              Печать (полная версия)
            </Link>
            <button
              onClick={handleExportToPDF}
              className="bg-blue-600 px-4 py-2 text-sm tracking-wide rounded-full text-white hover:bg-blue-700 duration-200 noprint"
            >
              Выгрузить все товары в PDF
            </button>
          </div>
        </div>
        <ProductsOpt />
      </div>
    </div>
  );
}
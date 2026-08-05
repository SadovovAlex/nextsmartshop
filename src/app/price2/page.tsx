// src/app/price2/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import Menu from "@/components/Menu";

interface GroupedProduct {
  category: string;
  products: ProductsStruct[];
  totalSum: number;
  count: number;
}

const PricePage2 = () => {
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();

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

  // Filter products (show hidden only for admin)
  const visibleProducts = useMemo(() => {
    if (admin) {
      return products;
    }
    return products.filter(product => product.hide !== 1);
  }, [products, admin]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, ProductsStruct[]>();
    
    visibleProducts.forEach(product => {
      const category = product.cat_name || 'Другое';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(product);
    });

    // Sort categories in a specific order
    const categoryOrder = [
      'Молоко', 'Сметана', 'Творог', 'Йогурты', 'Сыры', 
      'Масло', 'Кефир', 'Ряженка', 'Другое'
    ];

    const sortedGroups: GroupedProduct[] = [];
    
    // Add categories in defined order
    categoryOrder.forEach(catName => {
      const productList = groups.get(catName);
      if (productList && productList.length > 0) {
        sortedGroups.push({
          category: catName,
          products: productList.sort((a, b) => a.title.localeCompare(b.title)),
          totalSum: productList.reduce((sum, p) => sum + (p.price || 0), 0),
          count: productList.length
        });
        groups.delete(catName);
      }
    });

    // Add remaining categories
    groups.forEach((productList, category) => {
      sortedGroups.push({
        category,
        products: productList.sort((a, b) => a.title.localeCompare(b.title)),
        totalSum: productList.reduce((sum, p) => sum + (p.price || 0), 0),
        count: productList.length
      });
    });

    return sortedGroups;
  }, [visibleProducts]);

  // Flatten products with category headers for two-column layout
  const flattenedItems = useMemo(() => {
    const items: Array<{ type: 'header' | 'item'; value: any }> = [];
    
    groupedProducts.forEach(group => {
      // Add category header
      items.push({ 
        type: 'header', 
        value: { 
          name: group.category, 
          count: group.count,
          total: group.totalSum 
        } 
      });
      
      // Add products
      group.products.forEach(product => {
        items.push({ type: 'item', value: product });
      });
    });
    
    return items;
  }, [groupedProducts]);

  // Split into two columns
  const splitIndex = Math.ceil(flattenedItems.length / 2);
  const leftColumn = flattenedItems.slice(0, splitIndex);
  const rightColumn = flattenedItems.slice(splitIndex);

  // Calculate total products
  const totalProducts = visibleProducts.length;
  const totalCategories = groupedProducts.length;

  if (loading) {
    return (
      <>
        <Menu />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Загрузка прайс-листа...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      
      {/* Print version */}
      <div className="print-content">
        <div className="price-container">
          {/* Company header - как в price4 */}
          <div className="company-header">
            <div className="company-info">
              <h1>Рязанская молочная ферма «Заокское»</h1>
              <p className="company-subtitle">Натуральная молочная продукция высшего качества</p>
            </div>
            <div className="company-contact">
              <div className="contact-item">
                <span className="contact-label">Телефон:</span>
                <span className="contact-value">+7 (930) 888-76-78</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">ryazantvorog@gmail.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Доставка:</span>
                <span className="contact-value">Пн, Вт, Чт, Пт, Сб</span>
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="info-bar">
            <div className="info-item">
              <span className="info-label">Всего позиций:</span>
              <span className="info-value">{totalProducts}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Категорий:</span>
              <span className="info-value">{totalCategories}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Дата:</span>
              <span className="info-value">{new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Цены:</span>
              <span className="info-value">с НДС</span>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="price-grid">
            <div className="price-column">
              <PriceColumn items={leftColumn} />
            </div>
            <div className="price-column">
              <PriceColumn items={rightColumn} />
            </div>
          </div>

          {/* Footer */}
          <div className="price-footer">
            <div className="footer-left">
              <span>© {new Date().getFullYear()} Рязанская молочная ферма «Заокское»</span>
            </div>
            <div className="footer-center">
              <span>Работаем с розничными магазинами, сетями и продуктовыми рынками</span>
            </div>
            <div className="footer-right">
              <span>Все права защищены</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen preview - без прокрутки внутри колонок */}
      <div className="screen-preview pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Прайс-лист</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalProducts} товаров в {totalCategories} категориях
                {admin && <span className="ml-2 text-yellow-600">👁️ Режим администратора</span>}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Распечатать
              </button>
            </div>
          </div>

          {/* Two-column preview - БЕЗ ПРОКРУТКИ ВНУТРИ КОЛОНОК */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Левая колонка</h3>
              <div>
                <PriceColumnPreview items={leftColumn} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Правая колонка</h3>
              <div>
                <PriceColumnPreview items={rightColumn} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* ===== PRINT STYLES ===== */
        .print-content {
          display: none;
        }

        @media print {
          /* Reset and base */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: white;
            margin: 0;
            padding: 0;
            font-size: 7pt;
            line-height: 1.15;
            color: #1a1a1a;
          }

          /* Hide menu and screen elements */
          .screen-preview {
            display: none !important;
          }
          
          header, nav, .menu, .fixed {
            display: none !important;
          }

          .print-content {
            display: block !important;
          }

          /* Page setup - УВЕЛИЧИВАЕМ ПОЛЯ */
          @page {
            size: A4 portrait;
            margin: 1.2cm 1.5cm;
          }

          /* Main container - добавляем отступы */
          .price-container {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            page-break-after: avoid;
            padding: 0 0.2cm;
          }

          /* Company header */
          .company-header {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #1a1a1a;
            margin-bottom: 4px;
            flex-shrink: 0;
          }

          .company-info h1 {
            font-size: 12pt;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0;
            letter-spacing: 0.5px;
          }

          .company-subtitle {
            font-size: 6.5pt;
            color: #4b5563;
            margin: 0;
          }

          .company-contact {
            display: flex;
            flex-direction: column;
            gap: 1px;
            font-size: 6.5pt;
            text-align: right;
            justify-content: center;
          }

          .contact-item {
            display: flex;
            gap: 4px;
            justify-content: flex-end;
          }

          .contact-label {
            color: #6b7280;
          }

          .contact-value {
            font-weight: 600;
            color: #1a1a1a;
          }

          /* Info bar */
          .info-bar {
            display: flex;
            justify-content: space-around;
            padding: 3px 0;
            border-bottom: 1px solid #d1d5db;
            margin-bottom: 4px;
            flex-shrink: 0;
            font-size: 6pt;
          }

          .info-item {
            display: flex;
            gap: 4px;
          }

          .info-label {
            color: #6b7280;
          }

          .info-value {
            font-weight: 600;
            color: #1a1a1a;
          }

          /* Grid */
          .price-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5cm;
          }

          .price-column {
            display: flex;
            flex-direction: column;
            gap: 1px;
          }

          /* Category header - БЕЗ СУММЫ */
          .category-header {
            font-size: 8pt;
            font-weight: 700;
            padding: 2px 4px;
            margin-top: 3px;
            margin-bottom: 1px;
            background: #f3f4f6;
            border-bottom: 1.5px solid #9ca3af;
            color: #1f2937;
            display: flex;
            justify-content: space-between;
            align-items: center;
            page-break-after: avoid;
          }

          .category-name {
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .category-count {
            font-weight: 400;
            font-size: 6pt;
            color: #6b7280;
          }

          /* Product row */
          .product-row {
            display: grid;
            grid-template-columns: 18px 1fr auto;
            gap: 4px;
            padding: 1px 4px;
            border-bottom: 0.5px solid #e5e7eb;
            align-items: baseline;
            page-break-inside: avoid;
            min-height: 14px;
          }

          .product-row:last-child {
            border-bottom: none;
          }

          .product-row .index {
            font-size: 5.5pt;
            color: #9ca3af;
            text-align: right;
          }

          .product-row .name {
            font-size: 7.5pt;
            color: #1f2937;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .product-row .name .weight {
            font-size: 6pt;
            color: #6b7280;
            margin-left: 2px;
          }

          .product-row .price {
            font-size: 8pt;
            font-weight: 600;
            color: #111827;
            white-space: nowrap;
            text-align: right;
          }

          .product-row .price .currency {
            font-size: 5.5pt;
            font-weight: 400;
            color: #6b7280;
          }

          /* Hidden products (admin only) */
          .product-row.hidden {
            opacity: 0.35;
            background: #f9fafb;
          }

          .product-row.hidden .name::after {
            content: " [скрыт]";
            font-size: 4.5pt;
            color: #9ca3af;
          }

          /* Footer */
          .price-footer {
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px solid #d1d5db;
            font-size: 5.5pt;
            color: #6b7280;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 10px;
            text-align: center;
            flex-shrink: 0;
          }

          .footer-left {
            text-align: left;
          }

          .footer-right {
            text-align: right;
          }

          /* Prevent column breaks */
          .price-column {
            page-break-inside: avoid;
          }

          .category-header {
            page-break-after: avoid;
          }

          .price-grid {
            align-items: start;
          }

          .price-container {
            page-break-after: avoid;
          }
        }

        /* ===== SCREEN PREVIEW STYLES ===== */
        .preview-category {
          font-weight: 700;
          font-size: 13px;
          padding: 6px 10px;
          background: #f3f4f6;
          border-radius: 6px;
          margin-top: 10px;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #1f2937;
        }

        .preview-category:first-child {
          margin-top: 0;
        }

        .preview-category .count {
          font-weight: 400;
          font-size: 11px;
          color: #6b7280;
        }

        .preview-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          padding: 3px 10px;
          border-bottom: 1px solid #f3f4f6;
          align-items: center;
        }

        .preview-row:last-child {
          border-bottom: none;
        }

        .preview-row .name {
          color: #1f2937;
          font-size: 13px;
        }

        .preview-row .name .weight {
          color: #6b7280;
          font-size: 11px;
          margin-left: 3px;
        }

        .preview-row .price {
          font-weight: 600;
          color: #111827;
          font-size: 13px;
          white-space: nowrap;
        }

        .preview-row.hidden {
          opacity: 0.4;
          background: #f9fafb;
          border-radius: 4px;
        }

        .preview-row.hidden .name::after {
          content: " [скрыт]";
          font-size: 10px;
          color: #9ca3af;
        }

        .screen-preview .bg-white {
          max-height: none !important;
          overflow: visible !important;
        }

        @media (max-width: 768px) {
          .screen-preview .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

// Component for print column
const PriceColumn: React.FC<{ items: Array<{ type: 'header' | 'item'; value: any }> }> = ({ items }) => {
  let itemCounter = 0;

  return (
    <>
      {items.map((item, index) => {
        if (item.type === 'header') {
          itemCounter = 0;
          
          return (
            <div key={`header-${index}`} className="category-header">
              <span className="category-name">{item.value.name}</span>
              <span className="category-count">{item.value.count} поз.</span>
            </div>
          );
        }

        const product = item.value;
        const isHidden = product.hide === 1;
        itemCounter++;

        return (
          <div key={`item-${product._id}`} className={`product-row ${isHidden ? 'hidden' : ''}`}>
            <span className="index">{itemCounter}</span>
            <span className="name">
              {product.title}
              {product.weight && <span className="weight">{product.weight}</span>}
            </span>
            <span className="price">
              {product.price?.toFixed(2)} <span className="currency">₽</span>
            </span>
          </div>
        );
      })}
    </>
  );
};

// Component for screen preview
const PriceColumnPreview: React.FC<{ items: Array<{ type: 'header' | 'item'; value: any }> }> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => {
        if (item.type === 'header') {
          return (
            <div key={`preview-header-${index}`} className="preview-category">
              <span>{item.value.name}</span>
              <span className="count">{item.value.count} товаров</span>
            </div>
          );
        }

        const product = item.value;
        const isHidden = product.hide === 1;

        return (
          <div key={`preview-item-${product._id}`} className={`preview-row ${isHidden ? 'hidden' : ''}`}>
            <span className="name">
              {product.title}
              {product.weight && <span className="weight">{product.weight}</span>}
            </span>
            <span className="price">{product.price?.toFixed(2)} ₽</span>
          </div>
        );
      })}
    </>
  );
};

export default PricePage2;
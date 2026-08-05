// ProductsData.tsx - Исправленная версия с уведомлениями
"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductsStruct } from "../../type";
import { 
  FiShoppingCart, 
  FiStar, 
  FiPackage, 
  FiInfo, 
  FiTag,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import toast, { Toaster } from "react-hot-toast";

interface ProductsDataProps {
  item: ProductsStruct;
}

const ProductsData: React.FC<ProductsDataProps> = ({ item }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ===== БЕЗОПАСНОЕ ПОЛУЧЕНИЕ ЗНАЧЕНИЙ =====
  const safePrice = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const safeString = (value: any): string => {
    return value ? String(value) : '';
  };

  // Получаем безопасные значения
  const price = safePrice(item.price);
  const oldPrice = safePrice(item.oldPrice);
  const rating = safePrice(item.rating);
  const quantity = safePrice(item.quantity);
  const isNew = safePrice(item.isNew);

  // Расчет скидки
  const discount = oldPrice > price && oldPrice > 0
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  // Форматирование цены с защитой
  const formatPrice = (priceValue: number): string => {
    const safeValue = safePrice(priceValue);
    return safeValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Определение статуса наличия
  const inStock = quantity > 0;
  const stockStatus = inStock ? 'В наличии' : 'Нет в наличии';
  const stockColor = inStock ? 'text-green-600' : 'text-red-500';
  const stockBg = inStock ? 'bg-green-50' : 'bg-red-50';

  // ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПУТИ К ИЗОБРАЖЕНИЮ =====
  const getImagePath = (imageName: any): string => {
    const name = safeString(imageName);
    
    if (!name) {
      return '/static/no_photo.webp';
    }
    
    if (name.startsWith('/')) {
      return name;
    }
    
    if (name.startsWith('http://') || name.startsWith('https://')) {
      return name;
    }
    
    if (name.includes('static/products/')) {
      return name;
    }
    
    return `/static/products/${name}`;
  };

  const imageUrl = getImagePath(item.image);

  // ===== ОБРАБОТЧИК ДОБАВЛЕНИЯ В КОРЗИНУ С УВЕДОМЛЕНИЕМ =====
  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: item._id,
      title: safeString(item.title),
      price: price,
      image: imageUrl,
      quantity: 1,
    }));
    
    // Показываем уведомление
    toast.success(
      `+1 ${safeString(item.title).substring(0, 30)}${safeString(item.title).length > 30 ? '...' : ''}\nдобавлен в корзину`,
      {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
        },
        icon: '🛒',
      }
    );
  };

  // ===== ПЛЕЙСХОЛДЕР ДЛЯ ОШИБКИ ЗАГРУЗКИ =====
  const PlaceholderImage = () => (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <svg 
        className="w-16 h-16 text-gray-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
      <span className="mt-2 text-xs text-gray-400">Нет фото</span>
    </div>
  );

  return (
    <>
      <div 
        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ===== ВЕРХНЯЯ ЧАСТЬ С БЕЙДЖАМИ ===== */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {isNew === 1 && (
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
              Новинка
            </span>
          )}
          
          {discount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <FiTag className="w-3 h-3" />
              -{discount}%
            </span>
          )}
        </div>

        {/* Бейдж "В наличии" справа */}
        {/* <div className="absolute top-3 right-3 z-20">
          <span className={`${stockBg} ${stockColor} text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1`}>
            {inStock ? (
              <FiCheckCircle className="w-3 h-3" />
            ) : (
              <FiAlertCircle className="w-3 h-3" />
            )}
            {stockStatus}
          </span>
        </div> */}

        {/* ===== ИЗОБРАЖЕНИЕ ===== */}
        <Link href={`/product?_id=${item._id}`} className="block flex-shrink-0">
          <div className="relative w-full bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden" style={{ height: '280px' }}>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
            )}
            
            {imageError ? (
              <PlaceholderImage />
            ) : (
              <Image
                src={imageUrl}
                alt={safeString(item.title) || 'Фото товара'}
                width={650}
                height={650}
                className={`w-full h-full object-contain p-2 transition-all duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                quality={85}
                priority={false}
                unoptimized={imageUrl.startsWith('http')}
              />
            )}
          </div>
        </Link>

        {/* ===== ИНФОРМАЦИЯ О ПРОДУКТЕ ===== */}
        <div className="px-4 pb-6 pt-4 bg-white flex flex-col flex-1">
          
          {/* Категория и тип */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap min-h-[20px]">
            {item.cat_name && (
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded">
                {safeString(item.cat_name)}
              </span>
            )}
            {item.type && (
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded">
                {safeString(item.type)}
              </span>
            )}
          </div>

          {/* Название продукта */}
          <Link href={`/product?_id=${item._id}`}>
            <h3 className="text-base font-semibold text-gray-800 hover:text-orange-500 transition-colors line-clamp-2 min-h-[48px] leading-snug">
              {safeString(item.title) || 'Без названия'}
            </h3>
          </Link>

          {/* Состав - всегда показываем */}
          <div className="flex items-start gap-1.5 mt-2 min-h-[20px]">
            <FiPackage className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 line-clamp-1">
              {safeString(item.ingredients) || 'Состав не указан'}
            </p>
          </div>

          {/* Описание - всегда показываем */}
          <div className="flex items-start gap-1.5 mt-1.5 min-h-[20px]">
            <FiInfo className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 line-clamp-1">
              {safeString(item.description) || 'Описание отсутствует'}
            </p>
          </div>

          {/* ===== ЦЕНА И КОРЗИНА ===== */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-orange-500 whitespace-nowrap">
                    {formatPrice(price)} ₽
                  </span>
                  {oldPrice > price && oldPrice > 0 && (
                    <span className="text-sm text-gray-400 line-through whitespace-nowrap">
                      {formatPrice(oldPrice)} ₽
                    </span>
                  )}
                </div>
                
                {item.type && (
                  <span className="text-[10px] text-gray-400">
                    за {safeString(item.type) === 'вес' ? 'кг' : 'шт'}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`
                  flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                  transition-all duration-300
                  ${inStock 
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <FiShoppingCart className={`w-4 h-4 ${inStock ? 'group-hover:rotate-12' : ''} transition-transform flex-shrink-0`} />
                <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
                  {inStock ? 'В корзину' : 'Нет'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TOASTER ДЛЯ УВЕДОМЛЕНИЙ ===== */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            icon: '🛒',
            style: {
              background: '#22c55e',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          },
        }}
      />
    </>
  );
};

export default ProductsData;
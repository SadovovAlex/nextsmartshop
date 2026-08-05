// SingleProduct.tsx - Исправленная версия с AdminProductControls
"use client";

import React, { useEffect, useState } from "react";
import { getSingleProduct } from '@/helpers';
import { ProductsStruct } from '../../type';
import Image from "next/image";
import FormattedPrice from "./FormattedPrice";
import { IoMdCart } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import toast, { Toaster } from "react-hot-toast";
import AdminProductControls from './AdminProductControls';

type Props = {
  productId: number;
};

const SingleProduct: React.FC<Props> = ({ productId }) => {
  const [item, setProduct] = useState<ProductsStruct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    // Сбрасываем состояние при смене productId
    setProduct(null);
    setLoading(true);
    setError(null);
    setQuantity(1);

    const fetchProduct = async () => {
      try {
        const data = await getSingleProduct(productId);
        if (data) {
          setProduct(data);
        } else {
          setError('Товар не найден');
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setError('Ошибка загрузки товара');
      } finally {
        setLoading(false);
      }
    };

    if (productId && productId > 0) {
      fetchProduct();
    } else {
      setError('ID товара не указан');
      setLoading(false);
    }
  }, [productId]);

  // ===== БЕЗОПАСНОЕ ПОЛУЧЕНИЕ ЗНАЧЕНИЙ =====
  const safeString = (value: any): string => {
    return value ? String(value) : '';
  };

  const safePrice = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const safeQuantity = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПУТИ К ИЗОБРАЖЕНИЮ =====
  const getImagePath = (imageName: any): string => {
    const name = safeString(imageName);
    if (!name) return '/static/no_photo.webp';
    if (name.startsWith('http')) return name;
    if (name.startsWith('/')) return name;
    if (name.includes('static/products/')) return name;
    return `/static/products/${name}`;
  };

  // ===== ОБРАБОТЧИК ОБНОВЛЕНИЯ ТОВАРА =====
  const handleProductUpdate = (updatedProduct: any) => {
    setProduct(updatedProduct);
    toast.success('Данные товара обновлены');
  };

  // ===== ОБРАБОТЧИК ДОБАВЛЕНИЯ В КОРЗИНУ =====
  const handleAddToCart = () => {
    if (!item || item.quantity <= 0) {
      toast.error('Товар временно отсутствует');
      return;
    }

    dispatch(addToCart({
      ...item,
      quantity: quantity,
    }));
    
    toast.success(
      `+${quantity} ${safeString(item.title).substring(0, 30)}\nдобавлен в корзину`
    );
  };

  // ===== ИЗМЕНЕНИЕ КОЛИЧЕСТВА =====
  const increaseQuantity = () => {
    if (item && quantity < item.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // ===== КОМПОНЕНТ ЗАГРУЗКИ =====
  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-5 bg-white p-4 rounded-lg min-h-[400px]">
        <div className="animate-pulse">
          <div className="w-full max-h-[700px] h-[400px] bg-gray-200 rounded-lg" />
        </div>
        <div className="flex flex-col justify-center gap-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="flex items-center gap-x-2">
            <div className="h-10 bg-gray-200 rounded w-40" />
            <div className="h-10 bg-gray-200 rounded w-12" />
          </div>
        </div>
      </div>
    );
  }

  // ===== КОМПОНЕНТ ОШИБКИ =====
  if (error || !item) {
    return (
      <div className="bg-white p-8 rounded-lg text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          {error || 'Товар не найден'}
        </h3>
        <p className="text-gray-400">
          Попробуйте вернуться на главную и выбрать другой товар
        </p>
        <a 
          href="/" 
          className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          На главную
        </a>
      </div>
    );
  }

  // ===== ПРОВЕРКА НАЛИЧИЯ =====
  const inStock = item.quantity > 0;
  const availableQuantity = safeQuantity(item.quantity);

  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Админ контролы - вверху страницы */}
      <div className="mb-4">
        <AdminProductControls
          productId={item._id}
          currentData={{
            title: item.title,
            category_id: (item as any).category_id || 0,
            cat_name: item.cat_name || '',
            price: item.price,
            oldPrice: item.oldPrice,
            type: item.type || '',
            description: item.description || '',
            image: item.image || '',
            quantity: item.quantity,
            ingredients: item.ingredients || '',
            hide: (item as any).hide || 0,
            isNew: item.isNew || 0,
          }}
          onUpdate={handleProductUpdate}
        />
      </div>

      {/* Основной контент */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Левая колонка - изображение */}
        <div>
          <div className="relative">
            <Image
              src={getImagePath(item.image)}
              alt={safeString(item.title) || 'Фото товара'}
              width={500}
              height={500}
              className="w-full max-h-[700px] object-cover rounded-lg"
              priority
              onError={(e) => {
                e.currentTarget.src = '/static/no_photo.webp';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Бейдж "Нет в наличии" */}
            {!inStock && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                Нет в наличии
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 text-white text-sm font-semibold opacity-80 tracking-wide pointer-events-none">
              www.ryazantvorog.ru
            </div>
          </div>
        </div>

        {/* Правая колонка - информация */}
        <div className="flex flex-col justify-center gap-y-6">
          <div>
            <h1 className="text-3xl font-semibold">{safeString(item.title)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-bold text-orange-500">
                <FormattedPrice amount={safePrice(item.price)} />
              </p>
              {item.oldPrice > item.price && item.oldPrice > 0 && (
                <p className="text-sm text-gray-400 line-through">
                  <FormattedPrice amount={safePrice(item.oldPrice)} />
                </p>
              )}
            </div>
            
            {/* Индикатор наличия */}
            <div className="mt-2">
              {inStock ? (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  В наличии: {availableQuantity} шт.
                </span>
              ) : (
                <span className="text-sm text-red-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Нет в наличии
                </span>
              )}
            </div>
          </div>

          {item.description && (
            <p className="text-gray-600 leading-relaxed">{safeString(item.description)}</p>
          )}

          <div className="text-sm text-gray-500 flex flex-col gap-y-1">
            {item._id && (
              <span>
                #: <span className="text-gray-800">{item._id}</span>
              </span>
            )}
            {item.cat_name && (
              <span>
                Категория: <span className="text-gray-800">{safeString(item.cat_name)}</span>
              </span>
            )}
            {item.ingredients && (
              <span>
                Состав: <span className="text-gray-800">{safeString(item.ingredients)}</span>
              </span>
            )}
            {item.type && (
              <span>
                Тип: <span className="text-gray-800">{safeString(item.type)}</span>
              </span>
            )}
          </div>

          {/* ===== БЛОК КОРЗИНЫ ===== */}
          <div className="space-y-3">
            {/* Селектор количества - только если есть в наличии */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Количество:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= availableQuantity}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  макс. {availableQuantity}
                </span>
              </div>
            )}

            {/* Кнопка добавления в корзину */}
            <div
              onClick={inStock ? handleAddToCart : undefined}
              className={`flex items-center cursor-pointer group ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <button 
                className={`px-6 py-3 text-sm uppercase flex items-center border-r-[1px] transition-colors ${
                  inStock
                    ? 'bg-gray-800 text-slate-100 border-r-slate-500 hover:bg-gray-700'
                    : 'bg-gray-400 text-gray-200 border-r-gray-300 cursor-not-allowed'
                }`}
                disabled={!inStock}
              >
                {inStock ? 'Добавить в корзину' : 'Нет в наличии'}
              </button>
              <span className={`text-xl w-12 flex items-center justify-center py-3 transition-colors ${
                inStock
                  ? 'bg-gray-800 text-slate-100 group-hover:bg-orange-500 duration-200'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}>
                <IoMdCart />
              </span>
            </div>
            
            {/* Сообщение о недоступности */}
            {!inStock && (
              <p className="text-sm text-red-500">
                ⚠️ Товар временно отсутствует. Приносим извинения за неудобства.
              </p>
            )}
          </div>

          {/*
          <p className="flex items-center gap-x-2 text-sm">
            <MdFavoriteBorder className="text-xl" />
            Добавить в избранное
          </p>
          */}
        </div>
      </div>

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
    </div>
  );
};

export default SingleProduct;
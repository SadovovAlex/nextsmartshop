// cart/page.tsx - Улучшенная версия
"use client";

import Container from "@/components/Container";
import { useDispatch, useSelector } from "react-redux";
import { StateProps } from "../../../type";
import CartItem from "@/components/CartItem";
import { resetCart } from "@/redux/shoppingSlice";
import PaymentForm from "@/components/PaymentForm";
import Link from "next/link";
import SubmitOrderForm from "@/components/SubmitOrderForm";
import { Toaster } from "react-hot-toast";
import Menu from "@/components/Menu";
import { useEffect, useState } from "react";
import { FiShoppingBag, FiTrash2, FiArrowLeft, FiShoppingCart } from "react-icons/fi";

const CartPage = () => {
  const { productData } = useSelector((state: StateProps) => state?.shopping);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ===== ПОДСЧЕТ ИТОГОВ =====
  const calculateTotals = () => {
    if (!productData || productData.length === 0) {
      return { totalItems: 0, totalPrice: 0, totalOldPrice: 0, discount: 0 };
    }

    let totalItems = 0;
    let totalPrice = 0;
    let totalOldPrice = 0;

    productData.forEach((item: any) => {
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const oldPrice = Number(item.oldPrice) || 0;
      
      totalItems += quantity;
      totalPrice += price * quantity;
      totalOldPrice += oldPrice * quantity;
    });

    const discount = totalOldPrice > totalPrice ? totalOldPrice - totalPrice : 0;

    return { totalItems, totalPrice, totalOldPrice, discount };
  };

  const { totalItems, totalPrice, totalOldPrice, discount } = calculateTotals();

  // ===== ФОРМАТИРОВАНИЕ ЦЕНЫ =====
  const formatPrice = (price: number): string => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Если не смонтировано - показываем заглушку (для избежания гидратации)
  if (!isMounted) {
    return (
      <div>
        <Menu />
        <Container>
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Загрузка...</div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Menu />
      
      <Container>
        {/* ===== ХЕДЕР КОРЗИНЫ ===== */}
        <div className="py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-xl text-white">
                <FiShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Корзина
                </h1>
                {productData.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                  </p>
                )}
              </div>
            </div>
            
            {productData.length > 0 && (
              <button
                onClick={() => dispatch(resetCart())}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Очистить корзину</span>
              </button>
            )}
          </div>
        </div>

        {productData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
            {/* ===== ЛЕВАЯ КОЛОНКА - СПИСОК ТОВАРОВ ===== */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Заголовок таблицы */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6">Товар</div>
                  <div className="col-span-2 text-center">Цена</div>
                  <div className="col-span-2 text-center">Количество</div>
                  <div className="col-span-2 text-right">Итого</div>
                </div>
                
                {/* Список товаров */}
                <div className="divide-y divide-gray-100">
                  <CartItem />
                </div>
              </div>
            </div>

            {/* ===== ПРАВАЯ КОЛОНКА - ИТОГО ===== */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Итого по заказу
                </h2>

                {/* Детали */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Товары ({totalItems} шт.)</span>
                    <span className="text-gray-800 font-medium">
                      {formatPrice(totalPrice)} ₽
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Скидка</span>
                      <span className="text-green-600 font-medium">
                        -{formatPrice(discount)} ₽
                      </span>
                    </div>
                  )}
                  
                  {totalOldPrice > totalPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 line-through">Старая цена</span>
                      <span className="text-gray-400 line-through">
                        {formatPrice(totalOldPrice)} ₽
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-800">
                        К оплате
                      </span>
                      <span className="text-2xl font-bold text-orange-500">
                        {formatPrice(totalPrice)} ₽
                      </span>
                    </div>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="mt-6 space-y-3">
                  <Link href="/">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium">
                      <FiArrowLeft className="w-4 h-4" />
                      Продолжить покупки
                    </button>
                  </Link>
                </div>
              </div>

              {/* Формы оплаты и заказа */}
              <div className="mt-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Способ оплаты
                  </h3>
                  <PaymentForm />
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Данные для доставки
                  </h3>
                  <SubmitOrderForm />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ===== ПУСТАЯ КОРЗИНА =====
          <div className="min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm px-4 py-12">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <FiShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Корзина пуста
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Похоже, вы еще не добавили ни одного товара. 
              Начните покупки прямо сейчас!
            </p>
            <Link href="/">
              <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg">
                <FiArrowLeft className="inline mr-2" />
                Вернуться к выбору
              </button>
            </Link>
          </div>
        )}
      </Container>
      
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
            icon: '✅',
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

export default CartPage;
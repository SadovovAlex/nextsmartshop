// components/CartItem.tsx - Улучшенная версия
"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { StateProps } from "../../type";
import { addToCart, decreaseQuantity, deleteProduct } from "@/redux/shoppingSlice";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import toast from "react-hot-toast";

const CartItem = () => {
  const { productData } = useSelector((state: StateProps) => state.shopping);
  const dispatch = useDispatch();

  // Безопасное получение пути к изображению
  const getImagePath = (imageName: any): string => {
    const name = String(imageName || '');
    if (!name) return '/static/no_photo.webp';
    if (name.startsWith('http')) return name;
    if (name.startsWith('/')) return name;
    if (name.includes('static/products/')) return name;
    return `/static/products/${name}`;
  };

  // Форматирование цены
  const formatPrice = (price: number): string => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Увеличение количества
  const handleIncrease = (item: any) => {
    dispatch(addToCart(item));
  };

  // Уменьшение количества
  const handleDecrease = (item: any) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
    } else {
      dispatch(deleteProduct(item._id));
      toast.success(`${item.title.substring(0, 30)} удален из корзины`);
    }
  };

  // Удаление товара
  const handleDelete = (item: any) => {
    dispatch(deleteProduct(item._id));
    toast.success(`${item.title.substring(0, 30)} удален из корзины`);
  };

  if (!productData || productData.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-gray-100">
      {productData.map((item: any) => {
        const price = Number(item.price) || 0;
        const oldPrice = Number(item.oldPrice) || 0;
        const quantity = Number(item.quantity) || 1;
        const totalPrice = price * quantity;
        const discount = oldPrice > price ? oldPrice - price : 0;

        return (
          <div
            key={item._id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
          >
            {/* Изображение и название */}
            <div className="md:col-span-6 flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={getImagePath(item.image)}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {item.title}
                </h4>
                {item.cat_name && (
                  <span className="text-xs text-gray-400">{item.cat_name}</span>
                )}
              </div>
            </div>

            {/* Цена */}
            <div className="md:col-span-2 text-center">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-800">
                  {formatPrice(price)} ₽
                </span>
                {discount > 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(oldPrice)} ₽
                  </span>
                )}
              </div>
            </div>

            {/* Количество */}
            <div className="md:col-span-2 flex items-center justify-center">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleDecrease(item)}
                  className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <FiMinus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Итого и удаление */}
            <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
              <span className="text-sm font-semibold text-orange-500">
                {formatPrice(totalPrice)} ₽
              </span>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Удалить товар"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItem;
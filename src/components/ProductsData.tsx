"use client";

//TODO добавить вес продукта и в корзине отобразить вес общий заказа

import Image from "next/image";
import { ItemProps } from "../../type";
import { calculatePercentage } from "@/helpers";
import FormattedPrice from "./FormattedPrice";
import { IoIosStar } from "react-icons/io";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import toast, { Toaster } from "react-hot-toast";

const ProductsData = ({ item }: ItemProps) => {
  const dispatch = useDispatch();
  const startArray = Array.from({ length: item?.rating }, (_, index) => (
    <span key={index} className="text-yellow-400">
      <IoIosStar />
    </span>
  ));

  const discountPercentage = calculatePercentage(item?.oldPrice, item?.price);
  return (
    <div className="w-full h-[390px] rounded-lg overflow-hidden border-[1px] border-slate-300 flex flex-col">
      <div className="flex-shrink-0">
        <Link href={{ pathname: "/product", query: { _id: item?._id } }}>
          <div className="w-full h-48 group overflow-hidden relative">
            <Image
              src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
              alt="foto"
              width={650}
              height={650}
              className="w-full h-full object-cover group-hover:scale-110 duration-200 rounded-t-lg"
            />
            {item?.isNew === 1 && (
              <span className="absolute top-2 right-2 font-medium text-xs py-1 px-3 rounded-full bg-white group-hover:bg-orange-600 group-hover:text-white duration-200">
                Новинки
              </span>
            )}
          </div>
        </Link>
      </div>
      <div className="flex-1 border-[1px] border-slate-300 border-t-0 px-3 py-4 flex flex-col bg-white rounded-b-lg">
        <div className="flex flex-col h-full">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start justify-between">
              <div className="font-bold text-sm leading-tight flex-1 pr-2 h-10 overflow-hidden">
                <div className="line-clamp-2">
                  #{item?._id} {item?.title}
                </div>
              </div>
              <div className="text-xs whitespace-nowrap flex-shrink-0 ml-2">
                {item?.cat_name}
              </div>
            </div>
            <div className="text-sm text-gray-600 min-h-[1.25rem] flex items-center">
              {item?.ingredients || "Состав не указан"}
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 mt-auto">
            <div className="flex items-center justify-between">
              {parseFloat(discountPercentage) > 0 && (
                <div className="border-[1px] border-orange-600 py-1 px-3 rounded-full text-xs">
                  <p>{discountPercentage}% скидка</p>
                </div>
              )}

              <div className="flex items-center gap-x-2">
                {parseFloat(discountPercentage) > 0 && (
                  <p className="text-slate-500 line-through text-sm">
                    <FormattedPrice amount={item?.oldPrice} />
                  </p>
                )}
                <p className="font-semibold">
                  <FormattedPrice amount={item?.price} />
                  {item?.type && `/${item.type}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {/* Кнопка добавления в корзину */}
              <button
                onClick={() =>
                  dispatch(addToCart(item)) &&
                  toast.success(
                    `+1 ${item?.title.substring(0, 30)}\nдобавлен в корзину`
                  )
                }
                className="bg-orange-600 px-4 py-2 text-sm tracking-wide rounded-full text-slate-100 hover:bg-orange-800 hover:text-white duration-200"
              >
                В корзину
              </button>
              {/* Иконки звезд */}
              <div className="flex items-center gap-x-1">{startArray}</div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductsData;

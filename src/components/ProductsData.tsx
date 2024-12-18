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

interface Item {
  isNew: number; // Change this to number if it's a tinyint
  // other properties...
}

const ProductsData = ({ item }: ItemProps) => {
  const dispatch = useDispatch();
  const startArray = Array.from({ length: item?.rating }, (_, index) => (
    <span key={index} className="text-yellow-400">
      <IoIosStar />
    </span> 
  ));

  const discountPercentage = calculatePercentage(item?.oldPrice, item?.price);
  return (
    <div className="w-full rounded-lg overflow-hidden mt-10">
      <div>
        <Link href={{ pathname: "/product", query: { _id: item?._id } }}>
          <div className="w-full h-76 group overflow-hidden relative">
            <Image
              src={`/static/products/${item?.image}`}
              alt="product image"
              width={800}
              height={400}
              className="w-full h-full object-cover group-hover:scale-110 duration-200 rounded-t-lg md:w-3/4 md:h-3/4 sm:w-1/2 sm:h-1/2" // Измените размеры для маленьких экранов
            />
    

{item?.isNew === 1 && (
  <span className="absolute top-2 right-2 font-medium text-xs py-1 px-3 rounded-full bg-white group-hover:bg-orange-600 group-hover:text-white duration-200">
    Новинки
  </span>
)}


          </div>
        </Link>
        <div className="border-[1px] border-slate-300 border-t-0 px-2 py-4 flex flex-col gap-y-2 bg-white rounded-b-lg">
          <p>{item?.title}</p>
          <div className="flex items-center justify-between">
            {parseFloat(discountPercentage) > 0 && (
              <div className="border-[1px] border-orange-600 py-1 px-4 rounded-full text-xs">
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
      <Toaster />
    </div>
  );
};  

export default ProductsData;

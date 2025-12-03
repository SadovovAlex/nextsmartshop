"use client";

import Image from "next/image";
import { ItemProps } from "../../type";
import { IoIosStar } from "react-icons/io";
import Link from "next/link";

const ProductsDataOpt = ({ item }: ItemProps) => {
  const startArray = Array.from({ length: item?.rating }, (_, index) => (
    <span key={index} className="text-yellow-400">
      <IoIosStar />
    </span>
  ));

  return (
    <div className="w-full h-[390px] rounded-lg overflow-hidden border-[1px] border-slate-300 flex flex-col break-inside-avoid print:break-inside-avoid">
      <div className="flex-shrink-0">
        <div className="w-full h-52 group overflow-hidden relative">
          <Image
            src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
            alt="foto"
            width={200}
            height={500}
            className="w-full h-full object-cover rounded-t-lg print:h-32"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          
        </div>
      </div>
      <div className="flex-1 border-[1px] border-slate-300 border-t-0 px-3 py-4 flex flex-col bg-white rounded-b-lg print:p-2">
        <div className="flex flex-col h-full">
          <div className="flex flex-col space-y-2">
            <div className="font-bold text-sm leading-tight flex-1 pr-2 h-10 overflow-hidden print:text-sm">
              <div className="line-clamp-2 print:text-sm">
                Арт.{item?._id} {item?.title}
              </div>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 print:text-xs">
              Категория: {item?.cat_name}
            </div>
            <div className="text-sm text-gray-600 min-h-[1.25rem] flex items-center print:text-sm">
              {item?.ingredients || "Состав не указан"}
            </div>
            <div >
              
            </div>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default ProductsDataOpt;
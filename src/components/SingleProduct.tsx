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

type Props = {
  productId: number;
};

const SingleProduct: React.FC<Props> = ({ productId }) => {
  const [item, setProduct] = React.useState<ProductsStruct | null>(null);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSingleProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!item) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5 bg-white p-4 rounded-lg">

      <div>
        
        <Image
          //src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
          src={`/static/products/${item?.image}`}
          alt="product image"
          width={500}
          height={500}
          className="w-full max-h-[700px] object-cover rounded-lg"
          priority
        />
      </div>
      <div className="flex flex-col justify-center gap-y-10">
        <div>
          <p className="text-3xl font-semibold">{item?.title}</p>
          <p className="text-xl font-semibold">
            <FormattedPrice amount={item?.price} />
          </p>
        </div>
        <p className="text-lightText">{item?.description}</p>
        <div className="text-sm text-lightText flex flex-col">
          <span>
            #: <span className="text-darkText">{item?._id}</span>
          </span>
          <span>
            Категория: <span className="text-darkText">{item?.cat_name}</span>
          </span>
          <span>
            Состав: <span className="text-darkText">{item?.ingredients}</span>
          </span>
        </div>
        <div
          onClick={() =>
            dispatch(addToCart(item)) &&
         
            toast.success(
              `+1 ${item?.title.substring(0, 30)}\nдобавлен в корзину`
            )
          }
          className="flex items-center cursor-pointer group"
        >
          <button className="bg-darkText text-slate-100 px-6 py-3 text-sm uppercase flex items-center border-r-[1px] border-r-slate-500">
            Добавить в корзину
          </button>
          <span className="bg-darkText text-xl text-slate-100 w-12 flex items-center justify-center group-hover:bg-orange-500 duration-200 py-3">
            <IoMdCart />
          </span>
        </div>
        {/*
        <p className="flex items-center gap-x-2 text-sm">
          <MdFavoriteBorder className="text-xl" />
          Добавить в избранное
        </p>  */
        }
      </div>
      <Toaster />
    </div>
  );
};

export default SingleProduct;

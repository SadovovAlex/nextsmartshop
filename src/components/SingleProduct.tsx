"use client";

import Image from "next/image";
import FormattedPrice from "./FormattedPrice";
import { IoMdCart } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import toast, { Toaster } from "react-hot-toast";

const SignleProduct = ({ product }: any) => {
  
  // Выводим product в консоль
  console.log('SignleProduct=', product?.image);

  const dispatch = useDispatch();
  return (
    <div className="grid lg:grid-cols-2 gap-5 bg-white p-4 rounded-lg">
      <div>
        <Image
          src={`/static/products/${product?.image}`}
          alt="product image"
          width={500}
          height={500}
          className="w-full max-h-[700px] object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center gap-y-10">
        <div>
          <p className="text-3xl font-semibold">{product?.title}</p>
          <p className="text-xl font-semibold">
            <FormattedPrice amount={product?.price} />
          </p>
        </div>
        <p className="text-lightText">{product?.description}</p>
        <div className="text-sm text-lightText flex flex-col">
          <span>
            #: <span className="text-darkText">{product?._id}</span>
          </span>
          <span>
            Категория: <span className="text-darkText">{product?.category}</span>
          </span>
          <span>
            Состав: <span className="text-darkText">{product?.ingredients}</span>
          </span>
        </div>
        <div
          onClick={() =>
            dispatch(addToCart(product)) &&
         
            toast.success(
              `+1 ${product?.title.substring(0, 30)}\nдобавлен в корзину`
            )
          }
          className="flex items-center cursor-pointer group"
        >
          <button className="bg-darkText text-slate-100 px-6 py-3 text-sm uppercase flex items-center border-r-[1px] border-r-slate-500">
            add to cart
          </button>
          <span className="bg-darkText text-xl text-slate-100 w-12 flex items-center justify-center group-hover:bg-orange-500 duration-200 py-3">
            <IoMdCart />
          </span>
        </div>
        <p className="flex items-center gap-x-2 text-sm">
          <MdFavoriteBorder className="text-xl" />
          Добавить в избранное
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default SignleProduct;

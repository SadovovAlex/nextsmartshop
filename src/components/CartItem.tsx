import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductsStruct, StateProps } from "../../type";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  decreaseQuantity,
  deleteProduct,
  increaseQuantity,
} from "@/redux/shoppingSlice";
import FormattedPrice from "./FormattedPrice";

const CartItem = () => {
  const { productData } = useSelector((state: StateProps) => state?.shopping);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-y-2">
      <div className="hidden lg:inline-flex items-center justify-between font-semibold bg-white p-2">
        <p className="w-1/3">Продукция</p>
        <p className="w-1/3 flex items-center justify-center">Количество</p>
        <p className="w-1/3 flex items-center justify-end">Итого</p>
      </div>
      {/* Generate the product */}
      <div className="flex flex-col gap-y-2">
        {productData?.map((item: ProductsStruct) => (
          <div
            key={item._id}
            className="w-full bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-x-3 w-full md:w-1/3">
              <span
                onClick={() => dispatch(deleteProduct(item?._id))}
                className="text-lg hover:text-red-600 cursor-pointer duration-200"
              >
                <AiOutlineClose />
              </span>
              <Image
                src={item?.image ? `/static/products/${item?.image}` : '/static/no_photo.webp'}
                width={500}
                height={500}
                alt="product image"
                className="w-20 h-20 object-cover"
                loading="lazy"
              />
              {item?.title}
            </div>

            {/* quantity */}
            <div className="flex items-center justify-between gap-x-3 w-full md:w-auto">
              <div>
                <FormattedPrice amount={item?.price} />
              </div>
              <div className="flex items-center text-lg w-40 justify-between">
                <span
                  onClick={() => dispatch(decreaseQuantity(item))}
                  className="cursor-pointer"
                  title="Уменьшить количество"
                >
                  <FiChevronLeft />
                </span>
                <span className="text-2xl font-bold">
                  {item?.quantity && typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1}
                </span>
                <span
                  onClick={() => dispatch(increaseQuantity(item))}
                  className="cursor-pointer"
                  title="Увеличить количество"
                >
                  <FiChevronRight />
                </span>
              </div>
              <div className="flex items-end justify-end w-full md:w-1/3">
                <p className="text-2xl font-semibold">
                  <FormattedPrice amount={
                    (item?.price && typeof item.price === 'number' ? item.price : 0) *
                    (item?.quantity && typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1)
                  } />
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItem;

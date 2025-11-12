"use client";

import Container from "@/components/Container";
import { useDispatch, useSelector } from "react-redux";
import { StateProps } from "../../../type";
import CartItem from "@/components/CartItem";
import { resetCart, normalizeCartQuantities } from "@/redux/shoppingSlice";
import PaymentForm from "@/components/PaymentForm";
import Link from "next/link";
import SubmitOrderForm from "@/components/SubmitOrderForm";
import { Toaster } from "react-hot-toast";
import Menu from "@/components/Menu";
import { useEffect } from "react";

const CartPage = () => {
  const { productData } = useSelector((state: StateProps) => state?.shopping);
  const dispatch = useDispatch();

  // Normalize quantities when cart loads
  useEffect(() => {
    if (productData && productData.length > 0) {
      dispatch(normalizeCartQuantities());
    }
  }, [dispatch, productData]);

  return (
    <div>
    <Menu/>
    <Container>
      {productData.length > 0 ? (
        <Container>
          {/* заказы */}
          <h2 className="text-2xl font-semibold mb-2">Заказ</h2>
          <div className="flex flex-col gap-5">
            <CartItem />
            <div className="flex items-center justify-end">
              <button
                onClick={() => dispatch(resetCart())}
                className="bg-red-500 text-base font-semibold text-slate-100 py-2 px-6 hover:bg-red-700 hover:text-white duration-200"
              >
                Очистить весь заказ
              </button>
            </div>

            {/* Payment Form */}
            <PaymentForm />
          

            {/* SubmitOrderForm Form */}
            <SubmitOrderForm  />


          </div>
        </Container>
      ) : (
        <div className="flex flex-col gap-y-6 items-center justify-center bg-white h-96 px-4">
          <p className="border-[1px] border-orange-600 w-full p-2 text-center">
            Корзина пустая, добавьте продукты
          </p>
          <Link href={"/"}>
            <button className="bg-darkText text-white py-2 px-6 rounded-md hover:bg-orange-600 duration-200">
              Вернуться к выбору
            </button>
          </Link>
        </div>
      )}
    <Toaster />  
    </Container>
    </div>
  );
};

export default CartPage;

"use client";

import Container from "@/components/Container";
import { useDispatch, useSelector } from "react-redux";
import { StateProps } from "../../../type";
import CartItem from "@/components/CartItem";
import { resetCart } from "@/redux/shoppingSlice";
import PaymentForm from "@/components/PaymentForm";
import Link from "next/link";
import { useState } from "react";
import SubmitOrderForm from "@/components/SubmitOrderForm";

const CartPage = () => {
  const { productData } = useSelector((state: StateProps) => state?.shopping);
  const dispatch = useDispatch();
  
  // Состояние для управления видимостью формы
  const [isFormVisible, setFormVisible] = useState(false);
  
  // Обработчик для открытия формы
  const handleOpenForm = () => {
    setFormVisible(true);
  };

  return (
    <Container>
      {productData.length > 0 ? (
        <Container>
          {/* Кнопка "Назад" */}
          <div className="mb-4">
            <Link href={"/"}>
              <button className="bg-darkText text-white py-2 px-6 rounded-md hover:bg-orange-600 duration-200">
                На главную
              </button>
            </Link>
          </div>
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
            <SubmitOrderForm />


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
    </Container>
  );
};

export default CartPage;

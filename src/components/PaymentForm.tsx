"use client";

import { useDispatch, useSelector } from "react-redux";
import { ProductsStruct, StateProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { resetCart, saveOrder } from "@/redux/shoppingSlice";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const { productData, userInfo } = useSelector(
    (state: StateProps) => state?.shopping
  );
  const shippingThreshold = useMemo(() => parseFloat(process.env.NEXT_PUBLIC_V_SHIPPING_THRESHOLD || "5000"), []);
  const shippingCostValue = useMemo(() => parseFloat(process.env.NEXT_PUBLIC_V_SHIPPING_COST || "5000"), []);
  
  const totalAmt = useMemo(() => {
    return productData.reduce((sum, item: ProductsStruct) => {
      const quantity = item.quantity && !isNaN(Number(item.quantity)) ? Number(item.quantity) : 1;
      const price = item.price && !isNaN(Number(item.price)) ? Number(item.price) : 0;
      return sum + (price * quantity);
    }, 0);
  }, [productData]);

  const shippingCost = useMemo(() => {
    return totalAmt > shippingThreshold ? 0 : shippingCostValue;
  }, [totalAmt, shippingThreshold, shippingCostValue]);

  // =============  Stripe Payment Start here ==============
  const handleCheckout = async () => {}
  /*
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const { data: session } = useSession();
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch("https://smart-shop-vishwa.vercel.app/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: productData,
        email: session?.user?.email,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      await dispatch(saveOrder({ order: productData, id: data.id }));
      stripe?.redirectToCheckout({ sessionId: data.id });
      dispatch(resetCart());
    } else {
      throw new Error("Failed to create Stripe Payment");
    }
  };
  */
  // =============  Stripe Payment End here ================

  return (
    <div className="w-full bg-white p-4">
      <h2>Состав заказа</h2>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Заказ</p>
          <p>
            <FormattedPrice amount={totalAmt} />
          </p>
        </div>
      </div>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Доставка</p>
          <p>
            <FormattedPrice amount={shippingCost} />
          </p>
        </div>
        {shippingCost > 0 && (
          <p className="text-sm text-green-500 mt-1">Бесплатная доставка при заказе от 5000</p>
        )}
      </div>
  
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Итог</p>
          <p>
            <FormattedPrice amount={totalAmt + shippingCost} />
          </p>
        </div>
      </div>
      
      {
        /*
      userInfo ? (
        <button
          onClick={handleCheckout} 
    
          className="bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-orange-950 cursor-pointer duration-200"
        >
          Оформить заказ
        </button>
      ) : (
        <div>
          <button className="bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-orange-950 cursor-not-allowed duration-200">
            Оформить заказ
          </button>
          <p className="text-base mt-1 text-red-500 font-semibold animate-bounce">
            Войдите или зарегистрируйтесь для оформления заказа
          </p>
        </div>              
      )
      */}
  
     
    </div>
  );
  

};

export default PaymentForm;

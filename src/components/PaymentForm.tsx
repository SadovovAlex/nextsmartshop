"use client";

import { useDispatch, useSelector } from "react-redux";
import { ProductsStruct, StateProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { resetCart, saveOrder } from "@/redux/shoppingSlice";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const { productData, userInfo } = useSelector(
    (state: StateProps) => state?.shopping
  );
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCost, setShippingCost] = useState(5000); // Изначальная стоимость доставки

  useEffect(() => {
    let amt = 0;
    productData.map((item: ProductsStruct) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmt(amt);

   
    // Устанавливаем стоимость доставки в зависимости от суммы заказа
    const shippingThreshold = parseFloat(process.env.NEXT_PUBLIC_V_SHIPPING_THRESHOLD || "5000");
    const shippingCostValue = parseFloat(process.env.NEXT_PUBLIC_V_SHIPPING_COST || "5000");

    if (amt > shippingThreshold) {
      setShippingCost(0); // Бесплатная доставка
    } else {
      setShippingCost(shippingCostValue); // Стоимость доставки
    }
  }, [productData]);

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

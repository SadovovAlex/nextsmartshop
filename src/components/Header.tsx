"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";

import testUserImage from "../../public/user.png";
import { IoMdCart } from "react-icons/io";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { ProductsStruct, StateProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import Link from "next/link";
import { addUser, deleteUser } from "@/redux/shoppingSlice";
import { BsBookmarks } from "react-icons/bs";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const productData = useSelector((state: StateProps) => state.shopping.productData);
  const orderData = useSelector((state: StateProps) => state.shopping.orderData);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  useEffect(() => {
    if (session) {
      dispatch(
        addUser({
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
        })
      );
    } else {
      dispatch(deleteUser());
    }
  }, [session, dispatch]);

  const [totalAmt, setTotalAmt] = useState(0);

  useEffect(() => {
    let amt = 0;
    productData.map((item: ProductsStruct) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmt(amt);
  }, [productData]);

  return (
    <div className="bg-bodyColor h-30 top-1 sticky z-20">
      <Container className="h-full flex flex-col">
        {/* Первая строка: Логотип, Вход, Корзина */}
        <div className="flex items-center justify-between md:gap-x-5 mt-0">
          {/* Поле поиска */}
          <div className="w-2/3 bg-white flex items-center gap-x-1 border-[1px] border-lightText/50 rounded-full px-2 py-1.5 focus-within:border-orange-600 group">
            <FiSearch className="text-gray-500 group-focus-within:text-darkText duration-200" />
            <input
              type="text"
              placeholder="поиск продуктов"
              className="placeholder:text-sm flex-1 outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
         
          {/* Кнопка корзины */}
          <Link href={"/cart"}>
            <div className="bg-black hover:bg-slate-950 rounded-full text-slate-100 hover:text-white flex items-center justify-center gap-x-1 px-3 py-1.5 border-[1px] border-black hover:border-orange-600 duration-200 relative">
              <IoMdCart className="text-xl" />
              <p className="text-sm font-semibold">
                <FormattedPrice amount={totalAmt ? totalAmt : 0} />
              </p>
              <span className="bg-white text-orange-600 rounded-full text-xs font-semibold absolute -right-2 -top-1 w-4 h-4 flex items-center justify shadow-xl shadow-black">
                {productData ? productData?.length : 0}
              </span>
            </div>
          </Link>


          {/* Вход/Регистрация */}
          {/* !session && (
            <div onClick={() => signIn()} className="headerDiv cursor-pointer">
              <AiOutlineUser className="text-3xl" />
              <p className="text-sm font-semibold">Вход</p>
            </div>
          ) */}
        </div>

       
      </Container>
    </div>
  );

};



export default Header;

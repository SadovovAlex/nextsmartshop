"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
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
// Define the props type for the Header component
interface HeaderProps {
  onSearch: (searchTerm: string) => void; // Define the type for onSearch
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const productData = useSelector((state: StateProps) => state.shopping.productData);
  const orderData = useSelector((state: StateProps) => state.shopping.orderData);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`change: ${e.target.value}`)
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Pass the search value to the parent component
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
    <div className="bg-bodyColor h-20 top-0 sticky z-50">
      <Container className="h-full flex items-center md:gap-x-5 justify-between md:justify-start">
        <Logo />
        {/* Search Field */}
        <div className="w-1/3 bg-white hidden md:flex items-center gap-x-1 border-[1px] border-lightText/50 rounded-full px-2 py-1.5 focus-within:border-orange-600 group">
          <FiSearch className="text-gray-500 group-focus-within:text-darkText duration-200" />
          <input
            type="text"
            placeholder="поиск продуктов"
            className="placeholder:text-sm flex-1 outline-none"
            value={searchTerm}
            onChange={handleSearchChange} // Обработчик изменения
          />
        </div>
        {/* Phone Number */}
        <div className="hidden md:flex items-center text-sm font-semibold text-gray-700">
          <p>Телефон: 8-995-963-00-40</p>
        </div>
        {/* Login/Register */}
        {!session && (
          <div onClick={() => signIn()} className="headerDiv cursor-pointer">
            <AiOutlineUser className="text-3xl" />
            <p className="text-sm font-semibold">Вход</p>
          </div>
        )}
        {/* Cart button */}
        <Link href={"/cart"}>
          <div className="bg-black hover:bg-slate-950 rounded-full text-slate-100 hover:text-white flex items-center justify-center gap-x-1 px-3 py-1.5 border-[1px] border-black hover:border-orange-600 duration-200 relative">
            <IoMdCart className="text-xl" />
            <p className="text-sm font-semibold">
              <FormattedPrice amount={totalAmt ? totalAmt : 0} />
            </p>
            <span className="bg-white text-orange-600 rounded-full text-xs font-semibold absolute -right-2 -top-1 w-5 h-5 flex items-center justify-center shadow-xl shadow-black">
              {productData ? productData?.length : 0}
            </span>
          </div>
        </Link>
        {/* user Image */}
        {session && (
          <Image
            src={session?.user?.image as string || testUserImage}
            alt="user image"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
        )}
        {/* Order button */}
        {orderData?.order?.length > 0 && session && (
          <Link
            href={"/order"}
            className="headerDiv px-2 gap-x-1 cursor-pointer"
          >
            <BsBookmarks className="text-2xl" />
            <p className="text-sm font-semibold">Заказы</p>
          </Link>
        )}
        {/* Logout button */}
        {session && (
                    <div
                    onClick={() => signOut()}
                    className="headerDiv px-2 gap-x-1 cursor-pointer"
                  >
                    <FiLogOut className="text-2xl" />
                    <p className="text-sm font-semibold">Выход</p>
                  </div>
                )}
              </Container>
            </div>
          );
        };
        
        export default Header;
        

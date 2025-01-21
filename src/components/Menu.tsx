"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import Logo from "./Logo";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${isOpen ? "open" : ""}`}>
      <div className="flex justify-between items-center bg-gray-700 text-white p-2.5">
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          <FaBars />
        </div>
        <Link href="/">
          <Logo />
        </Link>
        <nav
          className={`absolute top-full left-0 w-48 bg-gray-700 shadow-md z-30 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:transform-none md:w-auto md:bg-transparent md:shadow-none md:flex md:justify-center`}
        >
          <ul className="list-none md:flex md:space-x-4 ">
            <li className="border-b border-gray-200 md:border-none text-white ">
              <a
                href="/"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                Главная
              </a>
            </li>
            <li className="border-b border-gray-200 md:border-none text-white">
              <a
                href="/price"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                Прайс
              </a>
            </li>
            <li className="border-b border-gray-200 md:border-none text-white">
              <a
                href="/about"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                О нас
              </a>
            </li>
            <li className="border-b border-gray-200 md:border-none text-white">
              <a
                href="/cart"
                className="block px-4 py-2 hover:bg-gray-200 hover:text-orange-500 md:hover:bg-transparent"
              >
                Корзина
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Menu;

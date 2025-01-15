"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";


const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
      const scrollThreshold = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (currentScrollPos < scrollThreshold * 0.02) {
        setIsMenuVisible(true);
      } else {
        setIsMenuVisible(currentScrollPos < prevScrollPos);
        setPrevScrollPos(currentScrollPos);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full bg-gray-800 text-white z-50 transition-all duration-300 ${isMenuVisible ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              className="mr-4 lg:hidden"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6 fill-white"
                viewBox="0 0 24 24"
              >
                <path d="M3 6.00092H21M3 12.0009H21M3 18.0009H21" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <clipPath id="clip0_429_11066">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.000915527)" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <nav
            className={`md:flex md:items-center ${isMenuOpen ? "block" : "hidden"
              }`}
          >
            <ul className="md:flex md:space-x-4">
              <li>
                <div className="w-1/3 text-sm font-semibold text-white text-right">
                  <Link href="/">
                    <div className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
                      Главная
                    </div>
                  </Link>
                </div>
              </li>
              <li>
                <div className="w-1/3 text-sm font-semibold text-white text-right">
                  <Link href={"/price"}>
                    <div className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
                      Прайс
                    </div>
                  </Link>
                </div>
              </li>
              <li>
                <Link href="/news">Новости</Link>
              </li>
              <li>
                <Link href="/cart">Корзина</Link>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Menu;

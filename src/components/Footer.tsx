"use client";
import {
  BsInstagram,
  BsGithub,
  BsLinkedin,
  BsFacebook,
  BsTwitter,
} from "react-icons/bs";
import payment from "@/images/payment.png";
import Container from "./Container";
import Logo from "./Logo";
import Link from "next/link";
import { TEXT } from '../constants/constants';
import packageJson from '../../package.json';
import Image from "next/image";

const Footer = () => {
  const handlePhoneClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:+79959630040';
    }
  };
  return (
    <div className="w-full bg-darkText text-slate-100">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        <div className="flex flex-col gap-y-4">

          <p className="text-xs transition duration-300 ease-in-out hover:text-gray-500">
            <span className="font-semibold animate-fadeIn">Работаем с розничными магазинами, сетями и продуктовыми рынками.</span>
            <br />
            <span className="font-semibold animate-fadeIn">Опт на выгодных условиях.</span>
            <br />
            <span className="font-semibold animate-fadeIn">Ветеринарное свидетельство отправляем по Меркурию.</span>
            <br />
            <span className="font-semibold animate-fadeIn">{TEXT.DELIVERY}</span>
            <br />
            <span className="font-semibold">Дни доставки:</span> пн, вт, чт, пт, сб.
          </p>

        </div>

        <div>
          {/* Phone Number */}
          <div className="">
            <div className="sm:block hidden text-xs font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
              Ферма Шуваловых
            </div>
            <div
              className="xs:text-xs text-sm font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px] cursor-pointer"
              onClick={handlePhoneClick}
            >+7(995)963-00-40
            </div>
            <div className="xs:text-xs text-sm font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px] cursor-pointer">
            ryazantvorog@gmail.com  
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col text-sm font-semibold text-white mt-2">

            {/* Address */}
            <div className="flex items-center mt-1">
              <p className="mr-2">Адрес:</p>
              <a
                href="https://maps.google.com/maps/search/%D0%9A%D0%BE%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB.%2C%2070%2C%20%D0%97%D0%B0%D0%BE%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB.%2C%20%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F%2C%20390019/@54.6898,39.7476,17z?hl=en"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Россия, 390019, Рязанская обл., село Заокское.
              </a>
            </div>

            {/* Working Hours */}
            <div className="flex items-center mt-1">
              <p className="mr-2">Часы работы:</p>
              <p>9:00 - 18:00</p>
            </div>
          </div>

          <div className="socialLink flex items-center gap-x-4">
            <a href="#" target="_blank">
              <span className="socialLink">
                <BsInstagram />
              </span>
            </a>
            <a href="#" target="_blank">
              <span className="socialLink">
                <BsGithub />
              </span>
            </a>
            <a href="#" target="_blank">
              <span className="socialLink">
                <BsLinkedin />
              </span>
            </a>
            <a href="#" target="_blank">
              <span className="socialLink">
                <BsFacebook />
              </span>
            </a>
            <a href="#" target="_blank">
              <span className="socialLink">
                <BsTwitter />
              </span>
            </a>
          </div>
        </div>

        <div className="links  py-4 px-6 md:px-0">
          <div className="container mx-auto">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-4 md:space-x-8">
              <li className="list-none">
                <Link href="/">
                  <div className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
                    Главная
                  </div>
                </Link>
              </li>
              <li className="list-none">
                <Link href={"/price"}>
                  <div className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
                    Прайс
                  </div>
                </Link>
              </li>
              <li className="list-none">
                <Link href="/about">
                  <div className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
                    О нас
                  </div>
                </Link>
              </li>
              <li className="list-none">
                <Link href="/cart">
                  <div className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
                    Корзина
                  </div>
                </Link>
              </li>
            </ul>
            <Image
              src="/static/qr-code.webp"
              alt="Лого"
              className="w-28 h-28 transition-transform duration-200 transform hover:scale-110 "
              width={500}
              height={300}
            />
          </div>
        </div>


      </Container>
      <footer className="bg-neutral-200 text-center lg:text-left dark:bg-neutral-700">
        <div className="p-2 text-neutral-700 dark:text-neutral-200 text-center">
          &copy; 2024 WR Shop. All rights reserved.&nbsp;
          <a
            href="#"
            className="text-neutral-800 dark:text-neutral-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            WR App v{packageJson.version}
          </a>
        </div>
      </footer>

    </div>
  );
};

export default Footer;

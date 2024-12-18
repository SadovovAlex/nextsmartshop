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
import Image from "next/image";
const Footer = () => {
  return (
    <div className="w-full bg-darkText text-slate-100">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="flex flex-col gap-y-4">
          <Logo />
          <p className="text-base transition duration-300 ease-in-out hover:text-gray-500">
            <span className="font-semibold animate-fadeIn">Работаем с розничными магазинами и продуктовыми рынками.</span>
            <br />
            <span className="font-semibold animate-fadeIn">Опт на выгодных условиях.</span>
            <br />
            <span className="font-semibold animate-fadeIn">Ветеринарное свидетельство отправляем по Меркурию.</span>
            <br />
            <span className="font-semibold animate-fadeIn">Бесплатная доставка в Москву и Московскую область, при определенной сумме заказа.</span>
            <br />
            <span className="font-semibold">Дни доставки:</span> пн, вт, чт, пт, сб.
          </p>

          {/* Phone Number */}
          <div className="items-center text-sm font-semibold text-white">
            <p>Телефон: 8-995-963-00-40</p>
          </div>

          {/* Email Address */}
          <div className="flex items-center text-sm font-semibold text-white">
            <p className="mr-2">Email:</p>
            <p>evgenii.sidorov19872801@gmail.com</p>
          </div>
          
         {/* Contact Information */}
<div className="flex flex-col text-sm font-semibold text-white mt-2">
  {/* Email Address */}
  <div className="flex items-center">
    <p className="mr-2">Email:</p>
    <p>evgenii.sidorov19872801@gmail.com</p>
  </div>

  {/* Address */}
  <div className="flex items-center mt-1">
    <p className="mr-2">Адрес:</p>
    <a 
      href="https://maps.google.com/maps/search/%D0%9A%D0%BE%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB.%2C%2070%2C%20%D0%97%D0%B0%D0%BE%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB.%2C%20%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F%2C%20390019/@54.6898,39.7476,17z?hl=en" 
      className="text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Кооперативная ул., 70, Заокское, Рязанская обл., Россия, 390019
    </a>
  </div>

  {/* Working Hours */}
  <div className="flex items-center mt-1">
    <p className="mr-2">Часы работы:</p>
    <p>9:00 - 18:00</p>
  </div>
</div>





          <div className="flex items-center gap-x-4">
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
        <div>
          <p className="text-lg">События</p>
          <ul className="text-sm font-light mt-2 flex flex-col gap-y-2">
            <li className="flex flex-col">
              <span className="text-slate hover:text-orange-600 cursor-pointer duration-200">
                Молочный фестиваль 2024
              </span>
              <span className="text-orange-600">Август 15, 2024</span>
            </li>
            <li className="flex flex-col">
              <span className="text-slate hover:text-orange-600 cursor-pointer duration-200">
                Вебинар: Польза молока для здоровья
              </span>
              <span className="text-orange-600">Сентябрь 10, 2024</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg">Ссылки</p>
          <ul className="text-base font-medium mt-2 flex flex-col gap-y-2">
            <Link href={"/"}>
              <li className="hover:text-orange-500 cursor-pointer duration-200">
                Главная
              </li>
            </Link>
            <Link href={"/cart"}>
              <li className="hover:text-orange-500 cursor-pointer duration-200">
                Корзина
              </li>
            </Link>
            <Link href={"/about"}>
              <li className="hover:text-orange-500 cursor-pointer duration-200">
                О нас
              </li>
            </Link>
            <Link href="/news" target="_blank">
              <li className="hover:text-orange-500 cursor-pointer duration-200">
                Новости
              </li>
            </Link>
          </ul>
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
            WR App
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

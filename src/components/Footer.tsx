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
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-y-4">
          <Logo />
          <p className="text-base text-gray-600 transition duration-300 ease-in-out hover:text-gray-100">
  <span className="font-semibold animate-fadeIn">Работаем с розничными магазинами и продуктовыми рынками.</span>
  <br />
  <span className="font-semibold animate-fadeIn">Работаем с оптом на выгодных условиях.</span>
  <br />
  <span className="font-semibold animate-fadeIn">Ветеринарное свидетельство отправляем по Меркурию.</span>
  <br />
  <span className="font-semibold animate-fadeIn">Бесплатная доставка в Москву и Московскую область.</span>
  <br />
  <span className="font-semibold">Дни доставки:</span> пн, вт, чт, пт, сб.
</p>


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
        <div>
          <p className="text-lg mb-2">Оплата</p>
          <Image
            src={payment}
            alt="payment banner image"
            className="w-full h-10 object-cover"
          />
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

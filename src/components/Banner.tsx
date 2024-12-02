"use client";
import Slider from "react-slick";
import bannerone from "@/images/bannerone.jpg";
import bannertwo from "@/images/bannertwo.jpg";
import bannerthree from "@/images/bannerthree.jpg";
import { PiCaretLeftLight, PiCaretRightLight } from "react-icons/pi";
import Image from "next/image";
import BannerText from "./BannerText";

const Banner = () => {
  const NextArrow = (props: { onClick: () => void }) => {
    return (
      <div
        className="p-3 bg-slate-100 hover:text-orange-600 hover:bg-white cursor-pointer duration-200 rounded-full text-2xl flex items-center justify-center z-20 absolute left-2 top-1/2"
        onClick={props.onClick}
      >
        <PiCaretRightLight />
      </div>
    );
  };

  const PrevArrow = (props: { onClick: () => void }) => {
    return (
      <div
        className="p-3 bg-slate-100 hover:text-orange-600 hover:bg-white cursor-pointer duration-200 rounded-full text-2xl flex items-center justify-center z-20 absolute right-2 top-1/2"
        onClick={props.onClick}
      >
        <PiCaretLeftLight />
      </div>
    );
  };
  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow onClick={() => {}} />, // Передаем пустую функцию
    prevArrow: <PrevArrow onClick={() => {}} />, // Передаем пустую функцию
  };
  
  return (
    <div className="relative">
{/*    
      <Slider {...settings}>
        <div className="w-full h-full relative">
          <Image
            src={bannerone}
            alt="bannerone"
            className="w-full h-full relative"
            priority
          />
          <BannerText title="Молочная ферма Шуваловых" />
        </div>
        <div className="w-full h-full relative">
          <Image
            src={bannertwo}
            alt="bannertwo"
            className="w-full h-full relative"
          />
          <BannerText title="Сезонные товары" />
        </div>
        <div className="w-full h-full relative">
          <Image
            src={bannerthree}
            alt="bannerthree"
            className="w-full h-full relative"
          />
          <BannerText title="Продукция из натурального молока" />
        </div>
      </Slider> */}
    
      <div className="absolute w-full h-44 bg-gradient-to-t from-gray-100 to-transparent bottom-0 left-0 z-10" />
    </div>
  );
};

export default Banner;

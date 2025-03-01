"use client";
import Slider from "react-slick";
import bannerone from "@/images/bannerone.webp";
import bannertwo from "@/images/bannertwo.jpg";
import bannerthree from "@/images/bannerthree.jpg";
import { PiCaretLeftLight, PiCaretRightLight } from "react-icons/pi";
import Image from "next/image";
import BannerText from "./BannerText";

interface ArrowProps {
  direction: "next" | "prev";
  onClick: () => void;
}

const Arrow: React.FC<ArrowProps> = ({ direction, onClick }) => {
  const isNext = direction === "next";
  const Icon = isNext ? PiCaretRightLight : PiCaretLeftLight;

  return (
    <div
      className={`p-3 bg-slate-100 hover:text-orange-600 hover:bg-white cursor-pointer duration-200 rounded-full text-2xl flex items-center justify-center z-20 absolute ${isNext ? 'left-2' : 'right-2'} top-1/2`}
      onClick={onClick}
    >
      <Icon />
    </div>
  );
};

const Banner = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow direction="next" onClick={() => {}} />,
    prevArrow: <Arrow direction="prev" onClick={() => {}} />,
  };

  const banners = [
    { image: bannerone, alt: 'Рязанская молочная ферма Заокское', title: 'Рязанская молочная ферма Заокское' },
    { image: bannertwo, alt: 'Сезонные товары', title: 'Сезонные товары' },
    { image: bannerthree, alt: 'Продукция из натурального молока', title: 'Продукция из натурального молока' },
  ];

  return (/*
    <div className="relative">
      <Slider {...settings}>
      

{banners.map((banner, index) => (
  <div key={index} className="w-full h-full relative">
    <Image
      src={banner.image}
      alt={banner.alt}
      className="w-full h-full object-cover"
      priority={index === 0} // Устанавливаем priority для первого изображения
    />
    <BannerText title={banner.title} />
  </div>
))}
</Slider>
*/
<div className="absolute w-full h-44 bg-gradient-to-t from-gray-100 to-transparent bottom-0 left-0 z-10" />
//</div>

);

};

export default Banner;

"use client";
import bannerone from "@/images/bannerone.webp";
import bannertwo from "@/images/bannertwo.webp";
import bannerthree from "@/images/bannerthree.webp";
import Image from "next/image";
import BannerText from "./BannerText";

const Banner = () => {
  const banners = [
    { image: bannerone, alt: 'Молочная ферма Шуваловых', title: 'Молочная ферма Шуваловых' },
    { image: bannertwo, alt: 'Молоко и продукция из натурального молока', title: 'Творог и творожная продукция' },
    { image: bannerthree, alt: 'Продукция из натурального молока', title: 'Домашняя Молочная продукция' },
  ];

 // Генерация случайного индекса баннера
 const currentBannerIndex = Math.floor(Math.random() * banners.length);
 //const currentBannerIndex = 0   // index 0,1,2
 const currentBanner = banners[currentBannerIndex];

 return (
  <div className="relative ">
    <div className="w-full h-auto relative sm:h-[500px] md:h-[600px]"> {/* Изменение высоты на мобильных устройствах */}
      <Image
        src={currentBanner.image}
        alt={currentBanner.alt}
        className="w-full h-full object-cover"
        priority={true}
      />
      <BannerText title={currentBanner.title} />
    </div>
    <div className=" w-full h-44 bg-gradient-to-t from-gray-100 to-transparent bottom-0 left-0 z-10" />
  </div>
);
};

export default Banner;

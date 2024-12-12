"use client";
import bannerone from "@/images/bannerone.jpg";
import bannertwo from "@/images/bannertwo.jpg";
import bannerthree from "@/images/bannerthree.jpg";
import Image from "next/image";
import BannerText from "./BannerText";

const Banner = () => {
  const banners = [
    { image: bannerone, alt: 'Молочная ферма Шуваловых', title: 'Молочная ферма Шуваловых' },
    { image: bannertwo, alt: 'Сезонные товары', title: 'Сезонные товары' },
    { image: bannerthree, alt: 'Продукция из натурального молока', title: 'Продукция из натурального молока' },
  ];

  // Выберите индекс баннера, который хотите отобразить
  const currentBannerIndex = 0; // Измените на 1 или 2 для других изображений
  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative">
      <div className="w-full h-full relative">
        <Image
          src={currentBanner.image}
          alt={currentBanner.alt}
          className="w-full h-full object-cover"
          priority={true} // Устанавливаем priority для изображения
        />
        <BannerText title={currentBanner.title} />
      </div>
      <div className="absolute w-full h-44 bg-gradient-to-t from-gray-100 to-transparent bottom-0 left-0 z-10" />
    </div>
  );
};

export default Banner;

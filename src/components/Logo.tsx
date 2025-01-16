import Link from "next/link";
import React from "react";
import Image from "next/image";

const Logo = () => {
  const handlePhoneClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:+79959630040';
    }
  };

  return (
  
      <div className="flex items-center cursor-pointer duration-200">
        <Image
          src="/static/logo.webp"
          alt="Лого"
          className="w-8 h-8 transition-transform duration-200 transform hover:scale-110"
          width={500}
          height={300}
        />

        <div className="">
          <div className="sm:block hidden text-xs font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
            Ферма Шуваловых
          </div>
          <div
            className="xs:text-xs text-sm font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px] cursor-pointer"
            onClick={handlePhoneClick}
          >
            +7(995)963-00-40
          </div>
        </div>
      </div>
  
  );
};

export default Logo;

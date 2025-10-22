import Link from "next/link";
import React from "react";
import Image from "next/image";
import { CONTACT } from "@/constants/text";

const Logo = () => {
  const handlePhoneClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${CONTACT.PHONE}`;
    }
  };
  const handleEmailClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${CONTACT.EMAIL}`;
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
          Рязанская молочная ферма Заокское
          </div>
          <div
            className="xs:text-xs text-sm font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px] cursor-pointer"
            onClick={handlePhoneClick}
          >
            {CONTACT.PHONE_FORMATTED} (заказы 08:00 - 10:00)
          </div>
          { /*
          <div
            className="xs:text-xs text-sm font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px] cursor-pointer"
            onClick={handleEmailClick}
          >
            ryazantvorog@gmail.com
          </div>
          */
        }
          

        </div>
        
      </div>
  
  );
};

export default Logo;

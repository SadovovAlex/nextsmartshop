import Link from "next/link";
import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="flex items-center cursor-pointer duration-200">
        <Image
          src="/static/logo.webp"
          alt="Логотип"
          className="w-16 h-16 transition-transform duration-200 transform hover:scale-110"
          width={500} 
          height={300} 
        />

        <h3 className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
          Ферма Шуваловых
        </h3>

      </div>
      
    </Link>
  );
};

export default Logo;

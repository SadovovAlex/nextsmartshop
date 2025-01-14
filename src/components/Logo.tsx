import Link from "next/link";
import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href={"/"}>
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
          <div className="xs:text-xs text-sm font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
            Заказ <a href="tel:89959630040" className="inline-block">8-995-963-00-40</a>
          </div>
        </div>

      </div>

    </Link>






  );
};

export default Logo;

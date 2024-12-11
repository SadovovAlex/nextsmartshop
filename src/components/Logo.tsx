import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="flex items-center cursor-pointer duration-200">
        <img
          src="/static/logo.png" // Путь к вашему изображению
          alt="Логотип"
          className="w-16 h-16 transition-transform duration-200 transform hover:scale-110"
        />
       <h3 className="text-base font-semibold hover:text-orange-500 transition-transform duration-200 transform hover:translate-y-[-2px]">
  Ферма Шуваловых
</h3>

      </div>
    </Link>
  );
};

export default Logo;

import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <h3 className="text-2xl font-semibold hover:text-orange-500 cursor-pointer duration-200">
        Молочная Ферма Шуваловых
      </h3>
    </Link>
  );
};

export default Logo;

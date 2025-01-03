"use client";

import PriceList from "@/components/PriceList";
import Container from "@/components/Container";
import Link from "next/link";

const PricePage = () => {
  return (
    <div>
      <Container>
          {/* Кнопка "Назад" */}
          <div className="mb-4">
          <Link href={"/"}>
            <button className="bg-darkText text-white py-2 px-6 rounded-md hover:bg-orange-600 duration-200">
              На главную
            </button>
          </Link>   
        </div>
        <PriceList searchTerm={""} />
      </Container>
    </div>

   
  );
};


export default PricePage;

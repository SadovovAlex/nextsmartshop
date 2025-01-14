"use client";

import PriceList from "@/components/PriceList";
import Container from "@/components/Container";

import Menu from "@/components/Menu"; 

const PricePage = () => {
  return (
    <div>
      <Menu />
      <Container>
      <PriceList searchTerm={""} />
      </Container>
    </div>

   
  );
};


export default PricePage;

"use client";

import PriceList from "@/components/PriceList";
import Container from "@/components/Container";

import Menu from "@/components/Menu";

const PricePage = () => {
  return (
    <div id="price-page" className="min-h-screen">
      <Menu />
      <Container>
      <PriceList searchTerm={""} />
      </Container>
    </div>

   
  );
};

// Add print styles to ensure content is visible when printing
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #price-page, #price-page * {
      visibility: visible;
    }
    #price-page {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
  }
`;

export default PricePage;

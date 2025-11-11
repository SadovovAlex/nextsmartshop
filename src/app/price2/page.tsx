"use client";

import { useEffect } from "react";
import PriceListGrouped from "@/components/PriceListGrouped";
import Container from "@/components/Container";

const PricePage2 = () => {
  useEffect(() => {
    // Add print styles to the document head
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        #price2-page, #price2-page * {
          visibility: visible;
        }
        #price2-page {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        footer, .footer {
          display: none !important;
        }
        .no-print {
          display: none !important;
        }
        table {
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      // Cleanup on component unmount
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div id="price2-page" className="min-h-screen">
      <Container>
      <PriceListGrouped searchTerm={""} />
      </Container>
    </div>
  );
};

export default PricePage2;
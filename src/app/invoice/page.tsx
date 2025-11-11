"use client";

import InvoiceList from "@/components/InvoiceList";
import Container from "@/components/Container";
import Menu from "@/components/Menu";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import PriceListGrouped from "@/components/PriceListGrouped";
import { useEffect } from "react";

const InvoicePage = () => {
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
          /* Hide Menu component during print */
          nav, .menu, [class*="menu"], [class*="Menu"] {
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
        <AdminRouteGuard>
          <PriceListGrouped searchTerm={""} />
        </AdminRouteGuard>
      </Container>
    </div>
  );
};



export default InvoicePage;
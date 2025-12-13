"use client";

import React, { useState, useEffect } from "react";
import PriceListHalf from "@/components/PriceListHalf"; 
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";

interface PageProps {
  searchParams: {
    search?: string;
  };
}

const Price3Page: React.FC<PageProps> = ({ searchParams }) => {
  const unwrappedParams = React.use(searchParams as any) as any;
  const searchTerm = unwrappedParams?.search || "";
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Split products into two halves
  const halfIndex = Math.ceil(products.length / 2);
  const leftProducts = products.slice(0, halfIndex);
  const rightProducts = products.slice(halfIndex);

  // Ensure both columns have the same number of rows
  const maxRows = Math.max(leftProducts.length, rightProducts.length);
  
  // Pad the shorter column with empty products
  const paddedLeftProducts = [...leftProducts, ...Array(maxRows - leftProducts.length).fill(null)];
  const paddedRightProducts = [...rightProducts, ...Array(maxRows - rightProducts.length).fill(null)];


  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Прайс-лист</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-0 print:page-break-before-avoid">
          <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent">
            
            <div className="p-4">
              <PriceListHalf
                products={paddedLeftProducts}
                searchTerm={searchTerm}
                title="Левая часть"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent">
           
            <div className="p-4">
              <PriceListHalf
                products={paddedRightProducts}
                searchTerm={searchTerm}
                title="Правая часть"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .print\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\:border-b-2 {
            border-bottom-width: 2px !important;
          }
          
          .print\:border-black {
            border-color: black !important;
          }
          
          .print\:grid-cols-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          
          .print\:gap-0 {
            gap: 0 !important;
          }
          
          /* Ensure proper page break behavior */
          @page {
            size: A4 portrait;
            margin: 0.5cm;
          }
          
          /* Hide unnecessary elements when printing */
          header, footer, nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Price3Page;
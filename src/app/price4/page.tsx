"use client";

import React, { useState, useEffect } from "react";
import PriceListGrouped from "@/components/PriceListGrouped";
import { getProducts } from "@/helpers";
import { ProductsStruct } from "../../../type";

interface PageProps {
  searchParams: {
    search?: string;
  };
}

interface GroupedProduct {
  groupName: string;
  products: ProductsStruct[];
  totalSum: number;
  firstImage: string;
}

const Price4Page: React.FC<PageProps> = ({ searchParams }) => {
  const unwrappedParams = React.use(searchParams as any) as any;
  const searchTerm = unwrappedParams?.search || "";
  const [products, setProducts] = useState<ProductsStruct[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);

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

  useEffect(() => {
    // Group products by first word of title
    const groups = new Map<string, ProductsStruct[]>();
    
    products.forEach(product => {
      const firstWord = product.title.split(' ')[0].toLowerCase();
      if (!groups.has(firstWord)) {
        groups.set(firstWord, []);
      }
      groups.get(firstWord)!.push(product);
    });

    // Calculate totals and create grouped structure
    const grouped = Array.from(groups.entries()).map(([groupName, products]) => {
      const totalSum = products.reduce((sum, product) => sum + product.price, 0);
      const firstImage = products[0]?.image || 'no_photo.webp';
      
      return {
        groupName: groupName.charAt(0).toUpperCase() + groupName.slice(1),
        products: products.sort((a, b) => a.title.localeCompare(b.title)),
        totalSum,
        firstImage
      };
    });

    // Sort groups alphabetically
    grouped.sort((a, b) => a.groupName.localeCompare(b.groupName));
    setGroupedProducts(grouped);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка буклета...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Буклет товаров</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-0">
          <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent">
           
            <div className="p-4">
              <PriceListGrouped 
                groupedProducts={groupedProducts.slice(0, Math.ceil(groupedProducts.length / 2))}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg print:shadow-none print:bg-transparent">
            
            <div className="p-4">
              <PriceListGrouped 
                groupedProducts={groupedProducts.slice(Math.ceil(groupedProducts.length / 2))}
                searchTerm={searchTerm}
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

export default Price4Page;